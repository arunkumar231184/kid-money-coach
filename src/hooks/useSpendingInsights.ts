import { useMemo } from "react";
import { Transaction } from "@/hooks/useTransactions";
import { startOfWeek, startOfMonth, subDays, isAfter, parseISO } from "date-fns";

export type Category = "snacks" | "gaming" | "fashion" | "transport" | "savings" | "entertainment" | "other";

export interface CategoryBreakdown {
  category: Category;
  label: string;
  icon: string;
  amount: number;
  count: number;
  percentage: number;
  color: string;
}

export interface SpendingInsight {
  type: "top_category" | "savings_rate" | "spending_trend" | "new_merchant" | "streak";
  title: string;
  message: string;
  trend: "up" | "down" | "neutral";
  value?: number;
}

export interface SpendingStats {
  totalSpent: number;
  totalIncome: number;
  netFlow: number;
  transactionCount: number;
  averageTransaction: number;
  savingsRate: number;
}

export interface SpendingInsightsData {
  categoryBreakdown: CategoryBreakdown[];
  insights: SpendingInsight[];
  weeklyStats: SpendingStats;
  monthlyStats: SpendingStats;
  topMerchants: { merchant: string; amount: number; count: number }[];
}

const categoryConfig: Record<Category, { label: string; icon: string; color: string }> = {
  snacks: { label: "Snacks", icon: "🍿", color: "hsl(25, 80%, 55%)" },
  gaming: { label: "Gaming", icon: "🎮", color: "hsl(280, 70%, 55%)" },
  fashion: { label: "Fashion", icon: "👕", color: "hsl(330, 70%, 60%)" },
  transport: { label: "Transport", icon: "🚌", color: "hsl(200, 70%, 50%)" },
  savings: { label: "Savings", icon: "💰", color: "hsl(145, 60%, 45%)" },
  entertainment: { label: "Entertainment", icon: "🎬", color: "hsl(260, 60%, 55%)" },
  other: { label: "Other", icon: "📦", color: "hsl(210, 15%, 60%)" },
};

function mapCategory(category: string): Category {
  const lower = category.toLowerCase();
  if (lower.includes("snack") || lower.includes("food")) return "snacks";
  if (lower.includes("gaming") || lower.includes("game")) return "gaming";
  if (lower.includes("fashion") || lower.includes("shop")) return "fashion";
  if (lower.includes("transport")) return "transport";
  if (lower.includes("saving")) return "savings";
  if (lower.includes("entertainment")) return "entertainment";
  return "other";
}

function calculateStats(transactions: Transaction[]): SpendingStats {
  const spending = transactions.filter(t => !t.is_income);
  const income = transactions.filter(t => t.is_income);
  
  const totalSpent = spending.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const totalIncome = income.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  return {
    totalSpent,
    totalIncome,
    netFlow: totalIncome - totalSpent,
    transactionCount: transactions.length,
    averageTransaction: spending.length > 0 ? totalSpent / spending.length : 0,
    savingsRate: totalIncome > 0 ? ((totalIncome - totalSpent) / totalIncome) * 100 : 0,
  };
}

export function useSpendingInsights(transactions: Transaction[] = []): SpendingInsightsData {
  return useMemo(() => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const monthStart = startOfMonth(now);
    const lastWeekStart = subDays(weekStart, 7);

    // Filter transactions by period
    const weeklyTransactions = transactions.filter(t => 
      isAfter(parseISO(t.transaction_date), weekStart)
    );
    
    const monthlyTransactions = transactions.filter(t => 
      isAfter(parseISO(t.transaction_date), monthStart)
    );

    const lastWeekTransactions = transactions.filter(t => {
      const date = parseISO(t.transaction_date);
      return isAfter(date, lastWeekStart) && !isAfter(date, weekStart);
    });

    // Calculate stats
    const weeklyStats = calculateStats(weeklyTransactions);
    const monthlyStats = calculateStats(monthlyTransactions);
    const lastWeekStats = calculateStats(lastWeekTransactions);

    // Category breakdown (spending only, from monthly data)
    const spendingTransactions = monthlyTransactions.filter(t => !t.is_income);
    const categoryTotals = new Map<Category, { amount: number; count: number }>();

    spendingTransactions.forEach(t => {
      const cat = mapCategory(t.category);
      const current = categoryTotals.get(cat) || { amount: 0, count: 0 };
      categoryTotals.set(cat, {
        amount: current.amount + Math.abs(t.amount),
        count: current.count + 1,
      });
    });

    const totalSpending = Array.from(categoryTotals.values()).reduce((sum, v) => sum + v.amount, 0);

    const categoryBreakdown: CategoryBreakdown[] = Array.from(categoryTotals.entries())
      .map(([category, data]) => ({
        category,
        ...categoryConfig[category],
        amount: data.amount,
        count: data.count,
        percentage: totalSpending > 0 ? (data.amount / totalSpending) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    // Top merchants
    const merchantTotals = new Map<string, { amount: number; count: number }>();
    spendingTransactions.forEach(t => {
      const current = merchantTotals.get(t.merchant) || { amount: 0, count: 0 };
      merchantTotals.set(t.merchant, {
        amount: current.amount + Math.abs(t.amount),
        count: current.count + 1,
      });
    });

    const topMerchants = Array.from(merchantTotals.entries())
      .map(([merchant, data]) => ({ merchant, ...data }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    // Generate insights
    const insights: SpendingInsight[] = [];

    // Top category insight
    if (categoryBreakdown.length > 0) {
      const top = categoryBreakdown[0];
      insights.push({
        type: "top_category",
        title: `${top.icon} Top Category`,
        message: `${top.label} makes up ${top.percentage.toFixed(0)}% of spending (£${top.amount.toFixed(2)})`,
        trend: "neutral",
        value: top.percentage,
      });
    }

    // Spending trend insight
    if (lastWeekStats.totalSpent > 0) {
      const change = weeklyStats.totalSpent - lastWeekStats.totalSpent;
      const percentChange = (change / lastWeekStats.totalSpent) * 100;
      const trend = change > 0 ? "up" : change < 0 ? "down" : "neutral";
      
      insights.push({
        type: "spending_trend",
        title: trend === "down" ? "📉 Great Progress!" : trend === "up" ? "📈 Heads Up" : "➖ Steady",
        message: change !== 0 
          ? `Spending is ${trend === "down" ? "down" : "up"} ${Math.abs(percentChange).toFixed(0)}% vs last week`
          : "Spending is about the same as last week",
        trend,
        value: percentChange,
      });
    }

    // Savings rate insight
    if (weeklyStats.totalIncome > 0) {
      const rate = weeklyStats.savingsRate;
      insights.push({
        type: "savings_rate",
        title: rate >= 20 ? "🌟 Super Saver!" : rate >= 10 ? "💪 Good Job!" : "💡 Tip",
        message: rate >= 20 
          ? `Amazing! Saved ${rate.toFixed(0)}% of income this week`
          : rate >= 10 
            ? `Saved ${rate.toFixed(0)}% of income - keep it up!`
            : rate > 0 
              ? `Saved ${rate.toFixed(0)}% - try setting a small savings goal!`
              : "No income tracked yet - add allowance to see savings rate",
        trend: rate >= 20 ? "up" : rate >= 10 ? "neutral" : "down",
        value: rate,
      });
    }

    return {
      categoryBreakdown,
      insights,
      weeklyStats,
      monthlyStats,
      topMerchants,
    };
  }, [transactions]);
}
