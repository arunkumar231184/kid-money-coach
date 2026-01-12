import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Tables } from "@/integrations/supabase/types";

export type Kid = Tables<"kids">;

export function useKids() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["kids", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("kids")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as Kid[];
    },
    enabled: !!user,
  });
}

export function useKid(kidId: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["kids", kidId],
    queryFn: async () => {
      if (!user || !kidId) return null;

      const { data, error } = await supabase
        .from("kids")
        .select("*")
        .eq("id", kidId)
        .single();

      if (error) throw error;
      return data as Kid;
    },
    enabled: !!user && !!kidId,
  });
}

export function useDeleteKid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (kidId: string) => {
      const { error } = await supabase.from("kids").delete().eq("id", kidId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kids"] });
    },
  });
}
