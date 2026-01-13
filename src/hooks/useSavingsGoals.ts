import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Tables, TablesInsert } from "@/integrations/supabase/types";

export type SavingsGoal = Tables<"savings_goals">;
export type SavingsGoalInsert = TablesInsert<"savings_goals">;

export function useSavingsGoals(kidId: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["savings_goals", kidId],
    queryFn: async () => {
      if (!user || !kidId) return [];

      const { data, error } = await supabase
        .from("savings_goals")
        .select("*")
        .eq("kid_id", kidId)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as SavingsGoal[];
    },
    enabled: !!user && !!kidId,
  });
}

export function useCreateSavingsGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (goal: SavingsGoalInsert) => {
      const { data, error } = await supabase
        .from("savings_goals")
        .insert(goal)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["savings_goals", data.kid_id] });
    },
  });
}

export function useUpdateSavingsGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<SavingsGoal> & { id: string }) => {
      const { data, error } = await supabase
        .from("savings_goals")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["savings_goals", data.kid_id] });
    },
  });
}

export function useDeleteSavingsGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, kidId }: { id: string; kidId: string }) => {
      const { error } = await supabase
        .from("savings_goals")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return { kidId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["savings_goals", data.kidId] });
    },
  });
}
