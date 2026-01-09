import { cn } from "@/lib/utils";
import { Star, Award, Flame, Target, Coins, Trophy } from "lucide-react";

type BadgeType = "saver" | "streak" | "goal" | "first-week" | "challenge-master";

interface AchievementBadgeProps {
  type: BadgeType;
  earned?: boolean;
  count?: number;
  className?: string;
}

const badgeConfig: Record<BadgeType, { 
  icon: typeof Star; 
  label: string; 
  gradient: string;
  description: string;
}> = {
  "saver": { 
    icon: Coins, 
    label: "Super Saver", 
    gradient: "from-success to-emerald-400",
    description: "Saved 50%+ of allowance"
  },
  "streak": { 
    icon: Flame, 
    label: "On Fire", 
    gradient: "from-accent to-orange-400",
    description: "3-day saving streak"
  },
  "goal": { 
    icon: Target, 
    label: "Goal Getter", 
    gradient: "from-primary to-teal-400",
    description: "Reached a savings goal"
  },
  "first-week": { 
    icon: Star, 
    label: "First Week", 
    gradient: "from-badge-gold to-yellow-400",
    description: "Completed first week"
  },
  "challenge-master": { 
    icon: Trophy, 
    label: "Champion", 
    gradient: "from-badge-gold to-amber-500",
    description: "Completed 5 challenges"
  },
};

export function AchievementBadge({ type, earned = true, count, className }: AchievementBadgeProps) {
  const config = badgeConfig[type];
  const Icon = config.icon;
  
  return (
    <div 
      className={cn(
        "group relative flex flex-col items-center gap-2",
        earned ? "cursor-pointer" : "opacity-40 grayscale",
        className
      )}
    >
      {/* Badge circle */}
      <div className={cn(
        "w-16 h-16 rounded-full flex items-center justify-center relative",
        earned && "animate-float",
        earned 
          ? `bg-gradient-to-br ${config.gradient} shadow-lg` 
          : "bg-muted"
      )}>
        <Icon className={cn(
          "w-7 h-7",
          earned ? "text-white" : "text-muted-foreground"
        )} />
        
        {/* Count badge */}
        {count && count > 1 && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-xs font-bold shadow-md">
            {count}
          </div>
        )}
        
        {/* Glow effect */}
        {earned && (
          <div className={cn(
            "absolute inset-0 rounded-full bg-gradient-to-br opacity-0 group-hover:opacity-50 transition-opacity blur-md",
            config.gradient
          )} />
        )}
      </div>
      
      {/* Label */}
      <div className="text-center">
        <p className="text-xs font-semibold text-foreground">{config.label}</p>
        <p className="text-[10px] text-muted-foreground">{config.description}</p>
      </div>
    </div>
  );
}
