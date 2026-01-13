import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SavingsThermometer } from "@/components/SavingsThermometer";
import { Trash2, Loader2 } from "lucide-react";
import type { SavingsGoal } from "@/hooks/useSavingsGoals";

interface SavingsGoalCardProps {
  goal: SavingsGoal;
  onDelete?: (goalId: string) => void;
  isDeleting?: boolean;
}

export function SavingsGoalCard({ goal, onDelete, isDeleting }: SavingsGoalCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start gap-4">
        <div className="text-3xl">{goal.icon || "🎯"}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-foreground truncate">{goal.name}</h4>
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
            current={Number(goal.current_amount) || 0}
            goal={Number(goal.target_amount)}
            label=""
          />
        </div>
      </div>
    </Card>
  );
}
