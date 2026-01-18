import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Settings2, 
  Plus, 
  Trash2,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { 
  useSpendingLimits, 
  useCreateSpendingLimit, 
  useDeleteSpendingLimit,
  SpendingLimit 
} from "@/hooks/useSpendingLimits";
import { Kid } from "@/hooks/useKids";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SpendingLimitsDialogProps {
  kid: Kid;
  trigger?: React.ReactNode;
}

const categories = [
  { value: "snacks", label: "🍿 Snacks", color: "cat-snacks" },
  { value: "gaming", label: "🎮 Gaming", color: "cat-gaming" },
  { value: "fashion", label: "👕 Fashion", color: "cat-fashion" },
  { value: "transport", label: "🚌 Transport", color: "cat-transport" },
  { value: "entertainment", label: "🎬 Entertainment", color: "bg-purple-100 text-purple-700" },
  { value: "other", label: "📦 Other", color: "bg-muted text-muted-foreground" },
];

const periods = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

export function SpendingLimitsDialog({ kid, trigger }: SpendingLimitsDialogProps) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("weekly");

  const { data: limits = [], isLoading } = useSpendingLimits(kid.id);
  const createMutation = useCreateSpendingLimit();
  const deleteMutation = useDeleteSpendingLimit();

  const handleAddLimit = async () => {
    if (!category || !amount || parseFloat(amount) <= 0) {
      toast.error("Please select a category and enter a valid amount");
      return;
    }

    // Check if limit already exists for this category/period
    const exists = limits.some(
      l => l.category === category && l.period === period
    );
    if (exists) {
      toast.error(`A ${period} limit for ${category} already exists`);
      return;
    }

    try {
      await createMutation.mutateAsync({
        kid_id: kid.id,
        category,
        limit_amount: parseFloat(amount),
        period,
      });
      toast.success("Spending limit added!");
      setCategory("");
      setAmount("");
    } catch (error: any) {
      toast.error(error.message || "Failed to add limit");
    }
  };

  const handleDeleteLimit = async (limitId: string) => {
    try {
      await deleteMutation.mutateAsync(limitId);
      toast.success("Limit removed");
    } catch (error: any) {
      toast.error(error.message || "Failed to remove limit");
    }
  };

  const getCategoryConfig = (categoryValue: string) => {
    return categories.find(c => c.value === categoryValue) || categories[5];
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Settings2 className="w-4 h-4" />
            Set Limits
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Spending Limits for {kid.name}
          </DialogTitle>
          <DialogDescription>
            Set category limits to get alerts when spending approaches the threshold.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Add new limit form */}
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Period</Label>
                <Select value={period} onValueChange={(v) => setPeriod(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {periods.map(p => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 space-y-2">
                <Label>Limit Amount (£)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="10.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleAddLimit}
                disabled={createMutation.isPending}
                className="self-end gap-2"
              >
                {createMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                Add
              </Button>
            </div>
          </div>

          {/* Existing limits */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Active Limits</h4>
            {isLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : limits.length > 0 ? (
              <div className="space-y-2">
                {limits.map(limit => {
                  const catConfig = getCategoryConfig(limit.category);
                  return (
                    <div 
                      key={limit.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          catConfig.color
                        )}>
                          {catConfig.label}
                        </span>
                        <div>
                          <span className="font-semibold">£{Number(limit.limit_amount).toFixed(2)}</span>
                          <span className="text-sm text-muted-foreground ml-1">
                            / {limit.period}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteLimit(limit.id)}
                        disabled={deleteMutation.isPending}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No spending limits set yet
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
