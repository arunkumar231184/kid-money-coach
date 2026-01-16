import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Trophy, Flame, Target, Coins, ShoppingBag, Check } from "lucide-react";
import { celebrateChallengeComplete } from "@/lib/confetti";

export type ChallengeType = "snack-tracker" | "save-allowance" | "no-impulse" | "round-ups" | "goal";
export type ChallengeStatus = "active" | "completed" | "upcoming" | "failed" | "paused";

interface ChallengeCardProps {
  type: ChallengeType;
  title: string;
  description: string;
  progress: number;
  target: number;
  status: ChallengeStatus;
  daysLeft?: number;
  className?: string;
  onMarkComplete?: () => void;
}

const challengeConfig: Record<ChallengeType, { icon: typeof Trophy; color: string; bgColor: string }> = {
  "snack-tracker": { icon: ShoppingBag, color: "text-category-snacks", bgColor: "bg-warning-light" },
  "save-allowance": { icon: Coins, color: "text-success", bgColor: "bg-success-light" },
  "no-impulse": { icon: Target, color: "text-primary", bgColor: "bg-primary-light" },
  "round-ups": { icon: Coins, color: "text-success", bgColor: "bg-success-light" },
  "goal": { icon: Trophy, color: "text-accent", bgColor: "bg-accent-light" },
};

export function ChallengeCard({ 
  type, 
  title, 
  description, 
  progress, 
  target, 
  status, 
  daysLeft,
  className,
  onMarkComplete
}: ChallengeCardProps) {
  const config = challengeConfig[type];
  const Icon = config.icon;
  const percentage = Math.min((progress / target) * 100, 100);
  const isCompleted = status === "completed";
  const isActive = status === "active";

  const handleMarkComplete = () => {
    celebrateChallengeComplete();
    onMarkComplete?.();
  };
  
  return (
    <Card className={cn(
      "p-4 card-hover border-2 relative overflow-hidden",
      status === "active" && "border-primary/20 animate-pulse-glow",
      status === "completed" && "border-success/30 bg-success-light/30",
      status === "upcoming" && "border-border opacity-70",
      className
    )}>
      {/* Status indicator */}
      {isCompleted && (
        <div className="absolute top-2 right-2">
          <span className="text-2xl animate-float">🏆</span>
        </div>
      )}
      
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
          config.bgColor
        )}>
          <Icon className={cn("w-6 h-6", config.color)} />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-foreground truncate">{title}</h4>
            {status === "active" && daysLeft && (
              <span className="inline-flex items-center gap-1 text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                <Flame className="w-3 h-3" />
                {daysLeft}d left
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
          
          {/* Progress */}
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-foreground">{progress}/{target}</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  isCompleted ? "bg-success" : "bg-primary"
                )}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Mark Complete Button */}
          {isActive && onMarkComplete && (
            <Button
              size="sm"
              variant="outline"
              className="mt-3 w-full gap-2 border-success text-success hover:bg-success hover:text-white"
              onClick={handleMarkComplete}
            >
              <Check className="w-4 h-4" />
              Mark Complete
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
