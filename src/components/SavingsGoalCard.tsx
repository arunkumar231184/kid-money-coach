import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SavingsThermometer } from "@/components/SavingsThermometer";
import { Trash2, Loader2, Plus, Minus } from "lucide-react";
import type { SavingsGoal } from "@/hooks/useSavingsGoals";

interface SavingsGoalCardProps {
  goal: SavingsGoal;
  onDelete?: (goalId: string) => void;
  onAddProgress?: (goal: SavingsGoal) => void;
  onSubtractProgress?: (goal: SavingsGoal) => void;
  isDeleting?: boolean;
}

export function SavingsGoalCard({ 
  goal, 
  onDelete, 
  onAddProgress,
  onSubtractProgress,
  isDeleting 
}: SavingsGoalCardProps) {
  const currentAmount = Number(goal.current_amount) || 0;
  const targetAmount = Number(goal.target_amount) || 0;
  const isComplete = currentAmount >= targetAmount;

  return (
    <Card className="p-4">
      <div className="flex items-start gap-4">
        <div className="text-3xl">{goal.icon || "🎯"}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-foreground truncate">{goal.name}</h4>
              {isComplete && <span className="text-xs bg-success/20 text-success px-2 py-0.5 rounded-full">Complete!</span>}
            </div>
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                onClick={() => onDelete(goal.id)}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
          <SavingsThermometer
            current={currentAmount}
            goal={targetAmount}
            label=""
          />
          
          {/* Progress buttons */}
          <div className="flex gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => onSubtractProgress?.(goal)}
              disabled={currentAmount <= 0}
            >
              <Minus className="w-4 h-4 mr-1" />
              Withdraw
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-success hover:text-success hover:bg-success/10"
              onClick={() => onAddProgress?.(goal)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
