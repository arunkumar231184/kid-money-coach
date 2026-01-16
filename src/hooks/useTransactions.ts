import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Transaction {
  id: string;
  kid_id: string;
  merchant: string;
  amount: number;
  category: string;
  description: string | null;
  transaction_date: string;
  is_income: boolean;
  external_id: string | null;
  bank_connection_id: string | null;
  created_at: string;
}

export function useTransactions(kidId?: string, limit = 20) {
  return useQuery({
    queryKey: ["transactions", kidId, limit],
    queryFn: async () => {
      if (!kidId) return [];
      
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("kid_id", kidId)
        .order("transaction_date", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as Transaction[];
    },
    enabled: !!kidId,
  });
}

export function useAddTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transaction: {
      kid_id: string;
      merchant: string;
      amount: number;
      category: string;
      description?: string;
      transaction_date?: string;
      is_income?: boolean;
    }) => {
      const { data, error } = await supabase
        .from("transactions")
        .insert({
          ...transaction,
          transaction_date: transaction.transaction_date || new Date().toISOString(),
          is_income: transaction.is_income ?? false,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionId: string) => {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", transactionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
