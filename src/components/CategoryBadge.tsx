import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Category = "snacks" | "gaming" | "fashion" | "transport" | "savings" | "other";

interface CategoryBadgeProps {
  category: Category;
  className?: string;
}

const categoryConfig: Record<Category, { label: string; className: string; icon: string }> = {
  snacks: { label: "Snacks", className: "cat-snacks", icon: "🍿" },
  gaming: { label: "Gaming", className: "cat-gaming", icon: "🎮" },
  fashion: { label: "Fashion", className: "cat-fashion", icon: "👕" },
  transport: { label: "Transport", className: "cat-transport", icon: "🚌" },
  savings: { label: "Savings", className: "cat-savings", icon: "💰" },
  other: { label: "Other", className: "bg-muted text-muted-foreground", icon: "📦" },
};

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const config = categoryConfig[category];
  
  return (
    <span 
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        config.className,
        className
      )}
    >
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
}
