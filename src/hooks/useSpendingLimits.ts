import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "@/hooks/useTransactions";
import { startOfDay, startOfWeek, startOfMonth, isAfter, parseISO } from "date-fns";

export interface SpendingLimit {
  id: string;
  kid_id: string;
  category: string;
  limit_amount: number;
  period: "daily" | "weekly" | "monthly";
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SpendingAlert {
  category: string;
  limit: SpendingLimit;
  spent: number;
  percentage: number;
  isExceeded: boolean;
  isWarning: boolean; // 80%+ of limit
}

export function useSpendingLimits(kidId?: string) {
  return useQuery({
    queryKey: ["spending-limits", kidId],
    queryFn: async () => {
      if (!kidId) return [];
      
      const { data, error } = await supabase
        .from("spending_limits")
        .select("*")
        .eq("kid_id", kidId)
        .eq("is_active", true)
        .order("category", { ascending: true });

      if (error) throw error;
      return data as SpendingLimit[];
    },
    enabled: !!kidId,
  });
}

export function useCreateSpendingLimit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (limit: {
      kid_id: string;
      category: string;
      limit_amount: number;
      period: "daily" | "weekly" | "monthly";
    }) => {
      const { data, error } = await supabase
        .from("spending_limits")
        .insert(limit)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spending-limits"] });
    },
  });
}

export function useUpdateSpendingLimit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; limit_amount?: number; is_active?: boolean }) => {
      const { data, error } = await supabase
        .from("spending_limits")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spending-limits"] });
    },
  });
}

export function useDeleteSpendingLimit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("spending_limits")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spending-limits"] });
    },
  });
}

function mapCategory(category: string): string {
  const lower = category.toLowerCase();
  if (lower.includes("snack") || lower.includes("food")) return "snacks";
  if (lower.includes("gaming") || lower.includes("game")) return "gaming";
  if (lower.includes("fashion") || lower.includes("shop")) return "fashion";
  if (lower.includes("transport")) return "transport";
  if (lower.includes("saving")) return "savings";
  if (lower.includes("entertainment")) return "entertainment";
  return "other";
}

export function useSpendingAlerts(
  limits: SpendingLimit[] = [],
  transactions: Transaction[] = []
): SpendingAlert[] {
  const now = new Date();

  return limits.map(limit => {
    // Determine period start date
    let periodStart: Date;
    switch (limit.period) {
      case "daily":
        periodStart = startOfDay(now);
        break;
      case "weekly":
        periodStart = startOfWeek(now, { weekStartsOn: 1 });
        break;
      case "monthly":
        periodStart = startOfMonth(now);
        break;
    }

    // Calculate spending for this category in the period
    const categorySpending = transactions
      .filter(t => {
        if (t.is_income) return false;
        const txDate = parseISO(t.transaction_date);
        if (!isAfter(txDate, periodStart)) return false;
        const txCategory = mapCategory(t.category);
        return txCategory === limit.category.toLowerCase();
      })
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const percentage = (categorySpending / limit.limit_amount) * 100;

    return {
      category: limit.category,
      limit,
      spent: categorySpending,
      percentage,
      isExceeded: categorySpending >= limit.limit_amount,
      isWarning: percentage >= 80 && percentage < 100,
    };
  }).filter(alert => alert.isWarning || alert.isExceeded);
}
