import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TRUELAYER_CLIENT_ID = Deno.env.get("TRUELAYER_CLIENT_ID")!;
const TRUELAYER_CLIENT_SECRET = Deno.env.get("TRUELAYER_CLIENT_SECRET")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Use sandbox for development, change to production URLs for live
const TRUELAYER_AUTH_URL = "https://auth.truelayer-sandbox.com";
const TRUELAYER_API_URL = "https://api.truelayer-sandbox.com";

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify user is authenticated (except for OPTIONS)
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    const body = await req.json();
    const action = body.action;

    if (action === "get-auth-url") {
      // Generate TrueLayer authorization URL
      const { kidId, redirectUri } = body;

      if (!kidId || !redirectUri) {
        return new Response(JSON.stringify({ error: "Missing kidId or redirectUri" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Store state in a secure way (kid ID encoded)
      const state = btoa(JSON.stringify({ kidId, timestamp: Date.now() }));
      
      const authUrl = new URL(`${TRUELAYER_AUTH_URL}/`);
      authUrl.searchParams.set("response_type", "code");
      authUrl.searchParams.set("client_id", TRUELAYER_CLIENT_ID);
      authUrl.searchParams.set("scope", "info accounts balance transactions offline_access");
      authUrl.searchParams.set("redirect_uri", redirectUri);
      authUrl.searchParams.set("providers", "uk-ob-all uk-oauth-all");
      authUrl.searchParams.set("state", state);

      console.log("Generated auth URL for kid:", kidId);

      return new Response(JSON.stringify({ authUrl: authUrl.toString(), state }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "exchange-code") {
      // Exchange authorization code for tokens
      const { code, state, redirectUri } = body;

      if (!code || !state || !redirectUri) {
        return new Response(JSON.stringify({ error: "Missing code, state, or redirectUri" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Decode state to get kid ID
      let stateData;
      try {
        stateData = JSON.parse(atob(state));
      } catch {
        return new Response(JSON.stringify({ error: "Invalid state" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { kidId } = stateData;
      console.log("Exchanging code for tokens, kid:", kidId);

      // Exchange code for tokens
      const tokenResponse = await fetch(`${TRUELAYER_AUTH_URL}/connect/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: TRUELAYER_CLIENT_ID,
          client_secret: TRUELAYER_CLIENT_SECRET,
          redirect_uri: redirectUri,
          code,
        }),
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error("Token exchange failed:", errorText);
        return new Response(JSON.stringify({ error: "Token exchange failed", details: errorText }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const tokens = await tokenResponse.json();
      console.log("Tokens received successfully");

      // Fetch account info to get bank name
      const accountsResponse = await fetch(`${TRUELAYER_API_URL}/data/v1/accounts`, {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });

      let accountInfo = { account_id: null, account_name: null, bank_name: null };
      if (accountsResponse.ok) {
        const accountsData = await accountsResponse.json();
        if (accountsData.results && accountsData.results.length > 0) {
          const account = accountsData.results[0];
          accountInfo = {
            account_id: account.account_id,
            account_name: account.display_name || account.account_number?.number,
            bank_name: account.provider?.display_name || "Connected Bank",
          };
        }
      }

      // Calculate token expiry
      const expiresAt = new Date(Date.now() + (tokens.expires_in * 1000));

      // Store bank connection in database
      const { data: connection, error: insertError } = await supabase
        .from("bank_connections")
        .insert({
          kid_id: kidId,
          provider: "truelayer",
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          token_expires_at: expiresAt.toISOString(),
          account_id: accountInfo.account_id,
          account_name: accountInfo.account_name,
          bank_name: accountInfo.bank_name,
          status: "active",
        })
        .select()
        .single();

      if (insertError) {
        console.error("Failed to store connection:", insertError);
        return new Response(JSON.stringify({ error: "Failed to store connection" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Update kid's bank_account_connected flag
      await supabase
        .from("kids")
        .update({ bank_account_connected: true })
        .eq("id", kidId);

      console.log("Bank connection stored successfully:", connection.id);

      return new Response(JSON.stringify({ 
        success: true, 
        connection: {
          id: connection.id,
          bank_name: accountInfo.bank_name,
          account_name: accountInfo.account_name,
        }
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "refresh-token") {
      const { connectionId } = body;

      // Get connection from database
      const { data: connection, error: fetchError } = await supabase
        .from("bank_connections")
        .select("*")
        .eq("id", connectionId)
        .single();

      if (fetchError || !connection) {
        return new Response(JSON.stringify({ error: "Connection not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (!connection.refresh_token) {
        return new Response(JSON.stringify({ error: "No refresh token available" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Refresh the token
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
        // Mark connection as expired
        await supabase
          .from("bank_connections")
          .update({ status: "expired" })
          .eq("id", connectionId);

        return new Response(JSON.stringify({ error: "Token refresh failed" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const tokens = await tokenResponse.json();
      const expiresAt = new Date(Date.now() + (tokens.expires_in * 1000));

      // Update connection
      await supabase
        .from("bank_connections")
        .update({
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token || connection.refresh_token,
          token_expires_at: expiresAt.toISOString(),
        })
        .eq("id", connectionId);

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    console.error("Error in truelayer-auth:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
