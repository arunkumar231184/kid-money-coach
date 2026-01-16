import { Card } from "@/components/ui/card";
import { CategoryBadge } from "@/components/CategoryBadge";
import { cn } from "@/lib/utils";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Transaction } from "@/hooks/useTransactions";
import { format } from "date-fns";

type Category = "snacks" | "gaming" | "fashion" | "transport" | "savings" | "other";

interface TransactionListProps {
  transactions: Transaction[];
  className?: string;
}

function mapCategory(category: string): Category {
  const lower = category.toLowerCase();
  if (lower.includes("snack") || lower.includes("food")) return "snacks";
  if (lower.includes("gaming") || lower.includes("game")) return "gaming";
  if (lower.includes("fashion") || lower.includes("shop")) return "fashion";
  if (lower.includes("transport")) return "transport";
  if (lower.includes("saving")) return "savings";
  return "other";
}

export function TransactionList({ transactions, className }: TransactionListProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {transactions.map((tx, index) => (
        <Card 
          key={tx.id} 
          className={cn(
            "p-3 flex items-center gap-3 card-hover border",
            "animate-fade-in"
          )}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {/* Amount indicator */}
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
            tx.is_income ? "bg-success-light" : "bg-secondary"
          )}>
            {tx.is_income ? (
              <ArrowDownLeft className="w-5 h-5 text-success" />
            ) : (
              <ArrowUpRight className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
          
          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium text-foreground truncate">{tx.merchant}</span>
              <span className={cn(
                "font-semibold shrink-0",
                tx.is_income ? "text-success" : "text-foreground"
              )}>
                {tx.is_income ? "+" : "-"}£{Math.abs(tx.amount).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <CategoryBadge category={mapCategory(tx.category)} />
              <span className="text-xs text-muted-foreground">
                {format(new Date(tx.transaction_date), "MMM d, yyyy")}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
