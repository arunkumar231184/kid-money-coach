import { cn } from "@/lib/utils";

interface SavingsThermometerProps {
  current: number;
  goal: number;
  label: string;
  className?: string;
}

export function SavingsThermometer({ current, goal, label, className }: SavingsThermometerProps) {
  const percentage = Math.min((current / goal) * 100, 100);
  
  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-sm font-semibold text-primary">
          £{current.toFixed(2)} / £{goal.toFixed(2)}
        </span>
      </div>
      <div className="h-4 bg-secondary rounded-full overflow-hidden">
        <div 
          className="thermometer-fill h-full rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-muted-foreground">
          {percentage.toFixed(0)}% complete
        </span>
        {percentage >= 100 && (
          <span className="text-xs font-medium text-success animate-bounce-gentle">
            🎉 Goal reached!
          </span>
        )}
      </div>
    </div>
  );
}
