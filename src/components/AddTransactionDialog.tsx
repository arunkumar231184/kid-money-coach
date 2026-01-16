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
import { Switch } from "@/components/ui/switch";
import { Plus, Loader2 } from "lucide-react";
import { useAddTransaction } from "@/hooks/useTransactions";
import { Kid } from "@/hooks/useKids";
import { toast } from "sonner";

interface AddTransactionDialogProps {
  kid: Kid;
  onTransactionAdded?: () => void;
  trigger?: React.ReactNode;
}

const categories = [
  "Food & Snacks",
  "Gaming",
  "Entertainment",
  "Shopping",
  "Transport",
  "Subscriptions",
  "Savings",
  "Allowance",
  "Gift",
  "Other",
];

export function AddTransactionDialog({ kid, onTransactionAdded, trigger }: AddTransactionDialogProps) {
  const [open, setOpen] = useState(false);
  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isIncome, setIsIncome] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const addTransactionMutation = useAddTransaction();

  const resetForm = () => {
    setMerchant("");
    setAmount("");
    setCategory("");
    setDescription("");
    setIsIncome(false);
    setDate(new Date().toISOString().split("T")[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!merchant.trim() || !amount || !category) {
      toast.error("Please fill in all required fields");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      await addTransactionMutation.mutateAsync({
        kid_id: kid.id,
        merchant: merchant.trim(),
        amount: parsedAmount,
        category,
        description: description.trim() || undefined,
        transaction_date: new Date(date).toISOString(),
        is_income: isIncome,
      });

      toast.success(isIncome ? "💰 Income added!" : "📝 Transaction added!");
      resetForm();
      setOpen(false);
      onTransactionAdded?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to add transaction");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Transaction
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Transaction for {kid.name}</DialogTitle>
          <DialogDescription>
            Manually log spending or income until Open Banking is connected.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Income toggle */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div>
              <Label htmlFor="is-income" className="font-medium">
                {isIncome ? "💰 This is income" : "🛒 This is spending"}
              </Label>
              <p className="text-xs text-muted-foreground">
                {isIncome ? "Money received (allowance, gift, etc.)" : "Money spent on something"}
              </p>
            </div>
            <Switch
              id="is-income"
              checked={isIncome}
              onCheckedChange={setIsIncome}
            />
          </div>

          {/* Merchant/Source */}
          <div className="space-y-2">
            <Label htmlFor="merchant">
              {isIncome ? "Source *" : "Where/What *"}
            </Label>
            <Input
              id="merchant"
              placeholder={isIncome ? "e.g., Allowance, Birthday gift" : "e.g., McDonald's, Game Store"}
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              required
            />
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (£) *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Notes (optional)</Label>
            <Input
              id="description"
              placeholder="Any additional details"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Submit */}
          <Button 
            type="submit" 
            className="w-full"
            disabled={addTransactionMutation.isPending}
          >
            {addTransactionMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            Add {isIncome ? "Income" : "Transaction"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
