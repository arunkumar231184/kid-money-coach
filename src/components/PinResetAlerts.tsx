import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePinResetRequests, useResolvePinResetRequest, PinResetRequest } from "@/hooks/usePinResetRequests";
import { KeyRound, X, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

interface PinResetAlertsProps {
  onResetPin: (kidId: string, kidName: string) => void;
}

export function PinResetAlerts({ onResetPin }: PinResetAlertsProps) {
  const { data: requests, isLoading } = usePinResetRequests();
  const resolveMutation = useResolvePinResetRequest();

  const handleResetPin = async (request: PinResetRequest) => {
    if (!request.kid) return;
    
    // Resolve the request as completed
    await resolveMutation.mutateAsync({ id: request.id, status: "completed" });
    
    // Trigger the Set PIN dialog
    onResetPin(request.kid_id, request.kid.name);
    toast.success("Opening PIN reset dialog");
  };

  const handleDismiss = async (requestId: string) => {
    await resolveMutation.mutateAsync({ id: requestId, status: "dismissed" });
    toast.info("Request dismissed");
  };

  if (isLoading || !requests || requests.length === 0) {
    return null;
  }

  return (
    <section className="mb-6">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <KeyRound className="w-5 h-5 text-warning" />
        PIN Reset Requests
      </h3>
      <div className="space-y-3">
        {requests.map((request) => (
          <Card key={request.id} className="p-4 border-warning/50 bg-warning/5">
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={request.kid?.avatar_url || undefined} />
                <AvatarFallback className="bg-warning/20 text-warning font-bold">
                  {request.kid?.name?.slice(0, 2).toUpperCase() || "??"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-foreground">
                  {request.kid?.name} forgot their PIN
                </p>
                <p className="text-sm text-muted-foreground">
                  Requested {formatDistanceToNow(new Date(request.requested_at), { addSuffix: true })}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleResetPin(request)}
                  disabled={resolveMutation.isPending}
                >
                  {resolveMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Reset PIN"
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDismiss(request.id)}
                  disabled={resolveMutation.isPending}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
