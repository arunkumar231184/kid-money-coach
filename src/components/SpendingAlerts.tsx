import { Card } from "@/components/ui/card";
import { AlertTriangle, AlertCircle, TrendingUp } from "lucide-react";
import { SpendingAlert } from "@/hooks/useSpendingLimits";
import { cn } from "@/lib/utils";

interface SpendingAlertsProps {
  alerts: SpendingAlert[];
  className?: string;
}

const categoryIcons: Record<string, string> = {
  snacks: "🍿",
  gaming: "🎮",
  fashion: "👕",
  transport: "🚌",
  entertainment: "🎬",
  savings: "💰",
  other: "📦",
};

export function SpendingAlerts({ alerts, className }: SpendingAlertsProps) {
  if (alerts.length === 0) return null;

  const exceededAlerts = alerts.filter(a => a.isExceeded);
  const warningAlerts = alerts.filter(a => a.isWarning && !a.isExceeded);

  return (
    <div className={cn("space-y-3", className)}>
      {/* Exceeded limits - Red alerts */}
      {exceededAlerts.map(alert => (
        <Card 
          key={alert.limit.id}
          className="p-4 border-2 border-destructive/30 bg-gradient-to-r from-destructive/10 to-transparent"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-destructive" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">{categoryIcons[alert.category.toLowerCase()] || "📦"}</span>
                <h4 className="font-semibold text-destructive">
                  {alert.category.charAt(0).toUpperCase() + alert.category.slice(1)} limit exceeded!
                </h4>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                £{alert.spent.toFixed(2)} spent of £{Number(alert.limit.limit_amount).toFixed(2)} {alert.limit.period} limit
              </p>
              <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-destructive rounded-full transition-all"
                  style={{ width: `${Math.min(alert.percentage, 100)}%` }}
                />
              </div>
              <p className="text-xs text-destructive mt-1 font-medium">
                {alert.percentage.toFixed(0)}% of limit used
              </p>
            </div>
          </div>
        </Card>
      ))}

      {/* Warning alerts - Orange/Yellow */}
      {warningAlerts.map(alert => (
        <Card 
          key={alert.limit.id}
          className="p-4 border-2 border-warning/30 bg-gradient-to-r from-warning-light to-transparent"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-warning" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">{categoryIcons[alert.category.toLowerCase()] || "📦"}</span>
                <h4 className="font-semibold text-warning-foreground">
                  Approaching {alert.category} limit
                </h4>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                £{alert.spent.toFixed(2)} spent of £{Number(alert.limit.limit_amount).toFixed(2)} {alert.limit.period} limit
              </p>
              <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-warning rounded-full transition-all"
                  style={{ width: `${alert.percentage}%` }}
                />
              </div>
              <p className="text-xs text-warning-foreground mt-1 font-medium flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {alert.percentage.toFixed(0)}% of limit used - slow down!
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
