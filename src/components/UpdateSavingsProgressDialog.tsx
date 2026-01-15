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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Minus } from "lucide-react";
import type { SavingsGoal } from "@/hooks/useSavingsGoals";
import { celebrateGoalReached } from "@/lib/confetti";

interface UpdateSavingsProgressDialogProps {
  goal: SavingsGoal | null;
  mode: "add" | "subtract";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (goalId: string, newAmount: number) => void;
  isUpdating?: boolean;
}

export function UpdateSavingsProgressDialog({
  goal,
  mode,
  open,
  onOpenChange,
  onUpdate,
  isUpdating,
}: UpdateSavingsProgressDialogProps) {
  const [amount, setAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal || !amount) return;

    const currentAmount = Number(goal.current_amount) || 0;
    const targetAmount = Number(goal.target_amount) || 0;
    const changeAmount = parseFloat(amount);
    
    if (isNaN(changeAmount) || changeAmount <= 0) return;

    const newAmount = mode === "add" 
      ? currentAmount + changeAmount 
      : Math.max(0, currentAmount - changeAmount);

    // Check if this update completes the goal
    const wasNotComplete = currentAmount < targetAmount;
    const willBeComplete = newAmount >= targetAmount;
    
    if (mode === "add" && wasNotComplete && willBeComplete) {
      // Trigger confetti celebration!
      setTimeout(() => celebrateGoalReached(), 300);
    }

    onUpdate(goal.id, newAmount);
    setAmount("");
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setAmount("");
    }
    onOpenChange(newOpen);
  };

  if (!goal) return null;

  const currentAmount = Number(goal.current_amount) || 0;
  const targetAmount = Number(goal.target_amount) || 0;
  const remaining = Math.max(0, targetAmount - currentAmount);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === "add" ? (
              <>
                <Plus className="w-5 h-5 text-success" />
                Add to Savings
              </>
            ) : (
              <>
                <Minus className="w-5 h-5 text-destructive" />
                Withdraw from Savings
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {mode === "add" 
              ? `Add money toward "${goal.name}"`
              : `Withdraw money from "${goal.name}"`
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Current progress */}
            <div className="bg-secondary/50 rounded-lg p-4 space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Current savings</span>
                <span className="font-semibold text-foreground">£{currentAmount.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Target</span>
                <span className="font-medium text-foreground">£{targetAmount.toFixed(2)}</span>
              </div>
              {mode === "add" && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Still needed</span>
                  <span className="font-medium text-primary">£{remaining.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Amount input */}
            <div className="space-y-2">
              <Label htmlFor="amount">
                Amount to {mode === "add" ? "add" : "withdraw"} (£)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={mode === "subtract" ? currentAmount : undefined}
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-7"
                  required
                />
              </div>
            </div>

            {/* Quick amounts */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Quick amounts</Label>
              <div className="flex gap-2">
                {[1, 5, 10, 20].map((quickAmount) => (
                  <Button
                    key={quickAmount}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setAmount(quickAmount.toString())}
                    disabled={mode === "subtract" && quickAmount > currentAmount}
                  >
                    £{quickAmount}
                  </Button>
                ))}
              </div>
            </div>

            {/* Preview */}
            {amount && parseFloat(amount) > 0 && (
              <div className="bg-primary-light rounded-lg p-3 text-sm">
                <span className="text-muted-foreground">New balance: </span>
                <span className="font-semibold text-foreground">
                  £{(mode === "add" 
                    ? currentAmount + parseFloat(amount) 
                    : Math.max(0, currentAmount - parseFloat(amount))
                  ).toFixed(2)}
                </span>
                {mode === "add" && currentAmount + parseFloat(amount) >= targetAmount && (
                  <span className="ml-2 text-success font-medium">🎉 Goal reached!</span>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isUpdating || !amount || parseFloat(amount) <= 0}
              variant={mode === "add" ? "default" : "destructive"}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  {mode === "add" ? <Plus className="w-4 h-4 mr-2" /> : <Minus className="w-4 h-4 mr-2" />}
                  {mode === "add" ? "Add" : "Withdraw"} £{amount || "0.00"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
