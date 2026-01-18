import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TRUELAYER_CLIENT_ID = Deno.env.get("TRUELAYER_CLIENT_ID")!;
const TRUELAYER_CLIENT_SECRET = Deno.env.get("TRUELAYER_CLIENT_SECRET")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const TRUELAYER_AUTH_URL = "https://auth.truelayer-sandbox.com";
const TRUELAYER_API_URL = "https://api.truelayer-sandbox.com";

// Category mapping for kid-friendly categories
const categoryMap: Record<string, string> = {
  "ATM": "Cash",
  "BILL_PAYMENT": "Bills",
  "CASH": "Cash",
  "CASHBACK": "Rewards",
  "CHEQUE": "Cash",
  "CORRECTION": "Other",
  "CREDIT": "Income",
  "DIRECT_DEBIT": "Subscriptions",
  "DIVIDEND": "Income",
  "FEE_CHARGE": "Fees",
  "INTEREST": "Income",
  "OTHER": "Other",
  "PURCHASE": "Shopping",
  "STANDING_ORDER": "Regular",
  "TRANSFER": "Transfer",
  "DEBIT": "Spending",
};

function categorizeTransaction(transaction: any): string {
  const category = transaction.transaction_category || "OTHER";
  const mapped = categoryMap[category] || "Other";
  
  // Try to be more specific based on merchant
  const merchant = (transaction.merchant_name || transaction.description || "").toLowerCase();
  
  if (merchant.includes("tesco") || merchant.includes("asda") || merchant.includes("sainsbury") || merchant.includes("lidl") || merchant.includes("aldi")) {
    return "Groceries";
  }
  if (merchant.includes("mcdonald") || merchant.includes("kfc") || merchant.includes("burger") || merchant.includes("pizza") || merchant.includes("nando")) {
    return "Food & Snacks";
  }
  if (merchant.includes("game") || merchant.includes("playstation") || merchant.includes("xbox") || merchant.includes("steam") || merchant.includes("nintendo")) {
    return "Gaming";
  }
  if (merchant.includes("spotify") || merchant.includes("netflix") || merchant.includes("disney") || merchant.includes("youtube")) {
    return "Entertainment";
  }
  if (merchant.includes("amazon") || merchant.includes("ebay") || merchant.includes("asos") || merchant.includes("shein")) {
    return "Shopping";
  }
  if (merchant.includes("tfl") || merchant.includes("uber") || merchant.includes("bus") || merchant.includes("train") || merchant.includes("rail")) {
    return "Transport";
  }
  
  return mapped;
}

async function refreshTokenIfNeeded(supabase: any, connection: any): Promise<string | null> {
  const expiresAt = new Date(connection.token_expires_at);
  const now = new Date();
  
  // If token expires in less than 5 minutes, refresh it
  if (expiresAt.getTime() - now.getTime() < 5 * 60 * 1000) {
    console.log("Token expiring soon, refreshing...");
    
    if (!connection.refresh_token) {
      console.error("No refresh token available");
      return null;
    }

    const tokenResponse = await fetch(`${TRUELAYER_AUTH_URL}/connect/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: TRUELAYER_CLIENT_ID,
        client_secret: TRUELAYER_CLIENT_SECRET,
        refresh_token: connection.refresh_token,
      }),
    });

    if (!tokenResponse.ok) {
      console.error("Token refresh failed");
      await supabase
        .from("bank_connections")
        .update({ status: "expired" })
        .eq("id", connection.id);
      return null;
    }

    const tokens = await tokenResponse.json();
    const newExpiresAt = new Date(Date.now() + (tokens.expires_in * 1000));

    await supabase
      .from("bank_connections")
      .update({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token || connection.refresh_token,
        token_expires_at: newExpiresAt.toISOString(),
      })
      .eq("id", connection.id);

    return tokens.access_token;
  }

  return connection.access_token;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const body = await req.json();
    const { connectionId, kidId, syncAll } = body;

    // For scheduled cron jobs, sync all active connections
    if (!connectionId && !kidId && !syncAll) {
      return new Response(JSON.stringify({ error: "Missing connectionId, kidId, or syncAll" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Starting sync:", syncAll ? "ALL connections" : connectionId ? `connection ${connectionId}` : `kid ${kidId}`);

    // Get connection(s) to sync
    let query = supabase
      .from("bank_connections")
      .select("*")
      .eq("status", "active");

    if (connectionId) {
      query = query.eq("id", connectionId);
    } else if (kidId) {
      query = query.eq("kid_id", kidId);
    }
    // If syncAll is true, we don't add any filter - sync all active connections

    const { data: connections, error: fetchError } = await query;

    if (fetchError) {
      console.error("Failed to fetch connections:", fetchError);
      return new Response(JSON.stringify({ error: "Failed to fetch connections" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!connections || connections.length === 0) {
      console.log("No active connections found to sync");
      return new Response(JSON.stringify({ message: "No active connections found", totalSynced: 0 }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Found ${connections.length} active connection(s) to sync`);

    let totalSynced = 0;
    const results = [];

    for (const connection of connections) {
      console.log("Syncing connection:", connection.id);

      // Refresh token if needed
      const accessToken = await refreshTokenIfNeeded(supabase, connection);
      if (!accessToken) {
        results.push({ connectionId: connection.id, error: "Token expired", synced: 0 });
        continue;
      }

      // Fetch accounts
      const accountsResponse = await fetch(`${TRUELAYER_API_URL}/data/v1/accounts`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!accountsResponse.ok) {
        console.error("Failed to fetch accounts");
        results.push({ connectionId: connection.id, error: "Failed to fetch accounts", synced: 0 });
        continue;
      }

      const accountsData = await accountsResponse.json();
      let syncedCount = 0;

      for (const account of accountsData.results || []) {
        // Fetch transactions for each account (last 90 days)
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - 90);
        
        const transactionsUrl = `${TRUELAYER_API_URL}/data/v1/accounts/${account.account_id}/transactions?from=${fromDate.toISOString()}&to=${new Date().toISOString()}`;
        
        const transactionsResponse = await fetch(transactionsUrl, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!transactionsResponse.ok) {
          console.error("Failed to fetch transactions for account:", account.account_id);
          continue;
        }

        const transactionsData = await transactionsResponse.json();
        
        for (const txn of transactionsData.results || []) {
          // Skip income transactions (positive amounts) unless explicitly marked
          const amount = Math.abs(txn.amount);
          const isIncome = txn.amount > 0 || txn.transaction_type === "CREDIT";
          
          const transaction = {
            kid_id: connection.kid_id,
            bank_connection_id: connection.id,
            external_id: txn.transaction_id,
            merchant: txn.merchant_name || txn.description || "Unknown",
            amount,
            category: categorizeTransaction(txn),
            description: txn.description,
            transaction_date: txn.timestamp,
            is_income: isIncome,
          };

          // Upsert transaction (insert or update if external_id exists)
          const { error: upsertError } = await supabase
            .from("transactions")
            .upsert(transaction, {
              onConflict: "external_id,kid_id",
              ignoreDuplicates: false,
            });

          if (!upsertError) {
            syncedCount++;
          } else {
            console.error("Failed to upsert transaction:", upsertError);
          }
        }
      }

      // Update last synced timestamp
      await supabase
        .from("bank_connections")
        .update({ last_synced_at: new Date().toISOString() })
        .eq("id", connection.id);

      totalSynced += syncedCount;
      results.push({ connectionId: connection.id, synced: syncedCount });
      console.log(`Synced ${syncedCount} transactions for connection ${connection.id}`);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      totalSynced,
      results 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    console.error("Error in truelayer-sync:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
