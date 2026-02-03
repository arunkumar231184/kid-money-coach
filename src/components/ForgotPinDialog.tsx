import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreatePinResetRequest } from "@/hooks/usePinResetRequests";
import { Loader2, CheckCircle, HelpCircle } from "lucide-react";

interface ForgotPinDialogProps {
  kidId: string;
  kidName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ForgotPinDialog({ kidId, kidName, open, onOpenChange }: ForgotPinDialogProps) {
  const [submitted, setSubmitted] = useState(false);
  const createRequest = useCreatePinResetRequest();

  const handleSubmit = async () => {
    try {
      await createRequest.mutateAsync(kidId);
      setSubmitted(true);
    } catch (error: any) {
      if (error.message === "A reset request is already pending") {
        setSubmitted(true);
      }
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after dialog closes
    setTimeout(() => setSubmitted(false), 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {!submitted ? (
          <>
            <DialogHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <HelpCircle className="w-6 h-6 text-primary" />
              </div>
              <DialogTitle className="text-center">Forgot your PIN?</DialogTitle>
              <DialogDescription className="text-center">
                Don't worry, {kidName}! We'll let your parent know so they can help you reset it.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button 
                onClick={handleSubmit} 
                disabled={createRequest.isPending}
                className="w-full"
              >
                {createRequest.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending request...
                  </>
                ) : (
                  "Ask parent for help"
                )}
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleClose}
                className="w-full"
              >
                Cancel
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <DialogTitle className="text-center">Request sent!</DialogTitle>
              <DialogDescription className="text-center">
                Your parent will get a notification to reset your PIN. Ask them to check their dashboard!
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={handleClose} className="w-full">
                Got it!
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
