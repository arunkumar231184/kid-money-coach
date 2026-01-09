import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, Lightbulb } from "lucide-react";

interface InsightCardProps {
  title: string;
  message: string;
  trend?: "up" | "down" | "neutral";
  category?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function InsightCard({ 
  title, 
  message, 
  trend, 
  category,
  actionLabel,
  onAction,
  className 
}: InsightCardProps) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  
  return (
    <Card className={cn(
      "p-4 border-2 border-primary/10 bg-gradient-to-br from-primary-light/50 to-transparent",
      className
    )}>
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Lightbulb className="w-5 h-5 text-primary" />
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-foreground">{title}</h4>
            {trend && (
              <div className={cn(
                "flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded",
                trend === "up" && "bg-warning-light text-warning-foreground",
                trend === "down" && "bg-success-light text-success",
                trend === "neutral" && "bg-secondary text-muted-foreground"
              )}>
                <TrendIcon className="w-3 h-3" />
                {category}
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{message}</p>
          
          {actionLabel && (
            <button 
              onClick={onAction}
              className="mt-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
            >
              {actionLabel} →
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
