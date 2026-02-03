import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PinResetRequest {
  id: string;
  kid_id: string;
  status: string;
  requested_at: string;
  resolved_at: string | null;
  kid?: {
    name: string;
    avatar_url: string | null;
  };
}

export function usePinResetRequests() {
  return useQuery({
    queryKey: ["pin-reset-requests"],
    queryFn: async (): Promise<PinResetRequest[]> => {
      const { data, error } = await supabase
        .from("pin_reset_requests")
        .select(`
          id,
          kid_id,
          status,
          requested_at,
          resolved_at,
          kid:kids(name, avatar_url)
        `)
        .eq("status", "pending")
        .order("requested_at", { ascending: false });

      if (error) throw error;
      
      // Flatten the kid object from array to object
      return (data || []).map((request: any) => ({
        ...request,
        kid: request.kid?.[0] || request.kid,
      }));
    },
  });
}

export function useCreatePinResetRequest() {
  return useMutation({
    mutationFn: async (kidId: string) => {
      // Check if there's already a pending request
      const { data: existing } = await supabase
        .from("pin_reset_requests")
        .select("id")
        .eq("kid_id", kidId)
        .eq("status", "pending")
        .single();

      if (existing) {
        throw new Error("A reset request is already pending");
      }

      const { data, error } = await supabase
        .from("pin_reset_requests")
        .insert({ kid_id: kidId })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  });
}

export function useResolvePinResetRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "completed" | "dismissed" }) => {
      const { error } = await supabase
        .from("pin_reset_requests")
        .update({ 
          status, 
          resolved_at: new Date().toISOString() 
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pin-reset-requests"] });
    },
  });
}
