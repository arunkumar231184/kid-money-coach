import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BankConnection {
  id: string;
  kid_id: string;
  provider: string;
  account_id: string | null;
  account_name: string | null;
  bank_name: string | null;
  connected_at: string;
  last_synced_at: string | null;
  status: "active" | "expired" | "revoked";
}

export function useBankConnections(kidId?: string) {
  return useQuery({
    queryKey: ["bank-connections", kidId],
    queryFn: async () => {
      if (!kidId) return [];
      
      const { data, error } = await supabase
        .from("bank_connections")
        .select("id, kid_id, provider, account_id, account_name, bank_name, connected_at, last_synced_at, status")
        .eq("kid_id", kidId)
        .order("connected_at", { ascending: false });

      if (error) throw error;
      return data as BankConnection[];
    },
    enabled: !!kidId,
  });
}

export function useConnectBank() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ kidId, redirectUri }: { kidId: string; redirectUri: string }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { data, error } = await supabase.functions.invoke("truelayer-auth", {
        body: { kidId, redirectUri, action: "get-auth-url" },
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (error) throw error;
      
      const response = typeof data === "string" ? JSON.parse(data) : data;
      
      if (response.error) throw new Error(response.error);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bank-connections"] });
    },
  });
}

export function useExchangeBankCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ code, state, redirectUri }: { code: string; state: string; redirectUri: string }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { data, error } = await supabase.functions.invoke("truelayer-auth", {
        body: { code, state, redirectUri, action: "exchange-code" },
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (error) throw error;
      
      const response = typeof data === "string" ? JSON.parse(data) : data;
      if (response.error) throw new Error(response.error);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bank-connections"] });
      queryClient.invalidateQueries({ queryKey: ["kids"] });
    },
  });
}

export function useSyncTransactions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ connectionId, kidId }: { connectionId?: string; kidId?: string }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { data, error } = await supabase.functions.invoke("truelayer-sync", {
        body: { connectionId, kidId },
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (error) throw error;
      
      const response = typeof data === "string" ? JSON.parse(data) : data;
      if (response.error) throw new Error(response.error);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["bank-connections"] });
    },
  });
}

export function useDeleteBankConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (connectionId: string) => {
      const { error } = await supabase
        .from("bank_connections")
        .delete()
        .eq("id", connectionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bank-connections"] });
      queryClient.invalidateQueries({ queryKey: ["kids"] });
    },
  });
}
