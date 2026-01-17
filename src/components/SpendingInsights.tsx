import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { TrendingUp, TrendingDown, Minus, PiggyBank, ShoppingBag, BarChart3 } from "lucide-react";
import { useSpendingInsights, type CategoryBreakdown, type SpendingInsight } from "@/hooks/useSpendingInsights";
import { Transaction } from "@/hooks/useTransactions";

interface SpendingInsightsProps {
  transactions: Transaction[];
  kidName: string;
  className?: string;
}

function InsightBadge({ insight }: { insight: SpendingInsight }) {
  const TrendIcon = insight.trend === "up" ? TrendingUp : insight.trend === "down" ? TrendingDown : Minus;
  
  return (
    <div className={cn(
      "flex items-start gap-3 p-3 rounded-lg",
      "bg-gradient-to-r",
      insight.trend === "up" && "from-warning-light to-transparent",
      insight.trend === "down" && "from-success-light to-transparent",
      insight.trend === "neutral" && "from-secondary to-transparent"
    )}>
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
        insight.trend === "up" && "bg-warning/20 text-warning",
        insight.trend === "down" && "bg-success/20 text-success",
        insight.trend === "neutral" && "bg-primary/20 text-primary"
      )}>
        <TrendIcon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-foreground">{insight.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{insight.message}</p>
      </div>
    </div>
  );
}

function CategoryBar({ category }: { category: CategoryBreakdown }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span>{category.icon}</span>
          <span className="font-medium text-foreground">{category.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">£{category.amount.toFixed(2)}</span>
          <span className="text-xs text-muted-foreground">({category.percentage.toFixed(0)}%)</span>
        </div>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ 
            width: `${category.percentage}%`,
            backgroundColor: category.color 
          }}
        />
      </div>
    </div>
  );
}

export function SpendingInsights({ transactions, kidName, className }: SpendingInsightsProps) {
  const { categoryBreakdown, insights, weeklyStats, monthlyStats, topMerchants } = useSpendingInsights(transactions);

  // Prepare pie chart data
  const pieData = categoryBreakdown.map(cat => ({
    name: cat.label,
    value: cat.amount,
    color: cat.color,
  }));

  const hasSpendingData = categoryBreakdown.length > 0;
  const hasInsights = insights.length > 0;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4 border-2 border-primary/10 bg-gradient-to-br from-primary-light/30 to-transparent">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground">This Week</span>
          </div>
          <p className="text-2xl font-bold text-foreground">£{weeklyStats.totalSpent.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">{weeklyStats.transactionCount} transactions</p>
        </Card>
        
        <Card className="p-4 border-2 border-success/10 bg-gradient-to-br from-success-light/30 to-transparent">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
              <PiggyBank className="w-4 h-4 text-success" />
            </div>
            <span className="text-xs text-muted-foreground">This Month</span>
          </div>
          <p className="text-2xl font-bold text-foreground">£{monthlyStats.totalSpent.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">£{monthlyStats.averageTransaction.toFixed(2)} avg</p>
        </Card>
      </div>

      {/* Insights Section */}
      {hasInsights && (
        <Card className="p-4">
          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            Smart Insights
          </h4>
          <div className="space-y-2">
            {insights.slice(0, 3).map((insight, idx) => (
              <InsightBadge key={idx} insight={insight} />
            ))}
          </div>
        </Card>
      )}

      {/* Category Breakdown */}
      {hasSpendingData ? (
        <Card className="p-4">
          <h4 className="font-semibold text-foreground mb-4">Spending by Category</h4>
          
          {/* Pie Chart */}
          <div className="h-48 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                  animationDuration={800}
                  animationBegin={0}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `£${value.toFixed(2)}`}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category Bars */}
          <div className="space-y-3">
            {categoryBreakdown.map(cat => (
              <CategoryBar key={cat.category} category={cat} />
            ))}
          </div>
        </Card>
      ) : (
        <Card className="p-6 text-center border-dashed border-2">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <BarChart3 className="w-6 h-6 text-primary" />
          </div>
          <p className="font-medium text-foreground">No spending data yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Add transactions to see {kidName}'s spending insights
          </p>
        </Card>
      )}

      {/* Top Merchants */}
      {topMerchants.length > 0 && (
        <Card className="p-4">
          <h4 className="font-semibold text-foreground mb-3">Top Merchants</h4>
          <div className="space-y-2">
            {topMerchants.map((merchant, idx) => (
              <div key={merchant.merchant} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground w-5">#{idx + 1}</span>
                  <span className="font-medium text-foreground">{merchant.merchant}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">£{merchant.amount.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{merchant.count} visit{merchant.count > 1 ? 's' : ''}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
