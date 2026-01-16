import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Landmark, 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ExternalLink
} from "lucide-react";
import { useConnectBank, useExchangeBankCode, useBankConnections, useSyncTransactions } from "@/hooks/useBankConnections";
import { Kid } from "@/hooks/useKids";
import { toast } from "sonner";
import { format } from "date-fns";

interface ConnectBankDialogProps {
  kid: Kid;
  trigger?: React.ReactNode;
}

export function ConnectBankDialog({ kid, trigger }: ConnectBankDialogProps) {
  const [open, setOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const connectBankMutation = useConnectBank();
  const exchangeCodeMutation = useExchangeBankCode();
  const syncMutation = useSyncTransactions();
  const { data: connections, refetch: refetchConnections } = useBankConnections(kid.id);

  const activeConnections = connections?.filter(c => c.status === "active") || [];
  const hasActiveConnection = activeConnections.length > 0;

  // Handle OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");

    if (code && state && !exchangeCodeMutation.isPending) {
      setOpen(true);
      setIsConnecting(true);
      
      // Clear URL params
      window.history.replaceState({}, document.title, window.location.pathname);

      const redirectUri = `${window.location.origin}/dashboard`;
      
      exchangeCodeMutation.mutate(
        { code, state, redirectUri },
        {
          onSuccess: (data) => {
            toast.success(`✅ ${data.connection?.bank_name || "Bank"} connected successfully!`);
            setIsConnecting(false);
            refetchConnections();
            
            // Auto-sync transactions after connection
            syncMutation.mutate({ kidId: kid.id });
          },
          onError: (error) => {
            toast.error(`Connection failed: ${error.message}`);
            setIsConnecting(false);
          },
        }
      );
    }
  }, []);

  const handleConnectBank = async () => {
    const redirectUri = `${window.location.origin}/dashboard`;
    
    try {
      const result = await connectBankMutation.mutateAsync({ 
        kidId: kid.id, 
        redirectUri 
      });
      
      if (result.authUrl) {
        // Redirect to TrueLayer authorization
        window.location.href = result.authUrl;
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to start bank connection");
    }
  };

  const handleSyncTransactions = async () => {
    try {
      const result = await syncMutation.mutateAsync({ kidId: kid.id });
      toast.success(`Synced ${result.totalSynced} transactions`);
    } catch (error: any) {
      toast.error(error.message || "Failed to sync transactions");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <Landmark className="w-4 h-4" />
            {hasActiveConnection ? "Manage Bank" : "Connect Bank"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-primary" />
            Open Banking for {kid.name}
          </DialogTitle>
          <DialogDescription>
            Securely connect a bank account to automatically import transactions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Security info */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <ShieldCheck className="w-4 h-4 text-success" />
              Bank-Grade Security
            </div>
            <ul className="text-xs text-muted-foreground space-y-1 ml-6">
              <li>• Read-only access - we can never move money</li>
              <li>• FCA regulated via TrueLayer</li>
              <li>• Revoke access anytime</li>
            </ul>
          </div>

          {/* Connection status */}
          {isConnecting ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                <p className="text-sm text-muted-foreground">Connecting to bank...</p>
              </div>
            </div>
          ) : hasActiveConnection ? (
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Connected Accounts</h4>
              {activeConnections.map((connection) => (
                <div 
                  key={connection.id} 
                  className="flex items-center justify-between p-3 bg-success/10 border border-success/20 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    <div>
                      <p className="font-medium text-sm">{connection.bank_name || "Bank Account"}</p>
                      <p className="text-xs text-muted-foreground">
                        {connection.account_name || "Connected"} • 
                        {connection.last_synced_at 
                          ? ` Last synced ${format(new Date(connection.last_synced_at), "MMM d, h:mm a")}`
                          : " Not synced yet"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button 
                onClick={handleSyncTransactions} 
                disabled={syncMutation.isPending}
                variant="outline"
                className="w-full gap-2"
              >
                {syncMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Sync Transactions Now
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Expired connections warning */}
              {connections?.some(c => c.status === "expired") && (
                <div className="flex items-center gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-warning" />
                  <p className="text-sm">Previous connection expired. Please reconnect.</p>
                </div>
              )}

              <Button 
                onClick={handleConnectBank}
                disabled={connectBankMutation.isPending}
                className="w-full gap-2"
              >
                {connectBankMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ExternalLink className="w-4 h-4" />
                )}
                Connect via Open Banking
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                You'll be redirected to your bank to authorize read-only access
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
