import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Tables } from "@/integrations/supabase/types";

export type Challenge = Tables<"challenges">;

export function useChallenges(kidId?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["challenges", kidId],
    queryFn: async () => {
      if (!user || !kidId) return [];

      const { data, error } = await supabase
        .from("challenges")
        .select("*")
        .eq("kid_id", kidId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Challenge[];
    },
    enabled: !!user && !!kidId,
  });
}

export function useActiveChallenges(kidId?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["challenges", kidId, "active"],
    queryFn: async () => {
      if (!user || !kidId) return [];

      const { data, error } = await supabase
        .from("challenges")
        .select("*")
        .eq("kid_id", kidId)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Challenge[];
    },
    enabled: !!user && !!kidId,
  });
}

export function useCreateChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (challenge: {
      kid_id: string;
      title: string;
      description: string;
      type: string;
      target_value: number;
      target_days?: number;
      reward_xp?: number;
      reward_badge?: string;
      end_date?: string;
    }) => {
      const { data, error } = await supabase
        .from("challenges")
        .insert(challenge)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["challenges", variables.kid_id] });
    },
  });
}

export function useUpdateChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<Challenge> & { id: string }) => {
      const { data, error } = await supabase
        .from("challenges")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
    },
  });
}

export function useDeleteChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (challengeId: string) => {
      const { error } = await supabase
        .from("challenges")
        .delete()
        .eq("id", challengeId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
    },
  });
}
