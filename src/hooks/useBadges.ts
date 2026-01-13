import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Tables } from "@/integrations/supabase/types";

export type Badge = Tables<"badges">;

export function useBadges(kidId: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["badges", kidId],
    queryFn: async () => {
      if (!user || !kidId) return [];

      const { data, error } = await supabase
        .from("badges")
        .select("*")
        .eq("kid_id", kidId)
        .order("earned_at", { ascending: false });

      if (error) throw error;
      return data as Badge[];
    },
    enabled: !!user && !!kidId,
  });
}
