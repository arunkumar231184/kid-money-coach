import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateSavingsGoal } from "@/hooks/useSavingsGoals";
import { Plus, Target, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import type { Kid } from "@/hooks/useKids";

const savingsGoalSchema = z.object({
  name: z.string().trim().min(1, "Goal name is required").max(100, "Name must be less than 100 characters"),
  target_amount: z.number().min(0.01, "Target amount must be at least £0.01").max(100000, "Target amount is too high"),
  icon: z.string().max(10, "Icon must be a single emoji"),
});

const ICON_OPTIONS = [
  { emoji: "🎮", label: "Gaming" },
  { emoji: "👟", label: "Trainers" },
  { emoji: "📱", label: "Tech" },
  { emoji: "🎸", label: "Music" },
  { emoji: "⚽", label: "Sports" },
  { emoji: "🎨", label: "Art" },
  { emoji: "📚", label: "Books" },
  { emoji: "🎁", label: "Gift" },
  { emoji: "✈️", label: "Travel" },
  { emoji: "🎯", label: "Other" },
];

interface CreateSavingsGoalDialogProps {
  kid: Kid;
  onGoalCreated?: () => void;
  trigger?: React.ReactNode;
}

export function CreateSavingsGoalDialog({ kid, onGoalCreated, trigger }: CreateSavingsGoalDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("🎯");
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const createGoalMutation = useCreateSavingsGoal();

  const resetForm = () => {
    setName("");
    setTargetAmount("");
    setSelectedIcon("🎯");
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const formData = {
      name: name.trim(),
      target_amount: parseFloat(targetAmount) || 0,
      icon: selectedIcon,
    };

    const result = savingsGoalSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      await createGoalMutation.mutateAsync({
        kid_id: kid.id,
        name: result.data.name,
        target_amount: result.data.target_amount,
        icon: result.data.icon,
        current_amount: 0,
        is_active: true,
      });
      
      toast.success(`Savings goal "${result.data.name}" created for ${kid.name}!`);
      resetForm();
      setOpen(false);
      onGoalCreated?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to create savings goal");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" className="gap-2">
            <Target className="w-4 h-4" />
            Set Goal
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Set Savings Goal for {kid.name}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Icon Selection */}
          <div className="space-y-2">
            <Label>Choose an Icon</Label>
            <div className="grid grid-cols-5 gap-2">
              {ICON_OPTIONS.map((option) => (
                <button
                  key={option.emoji}
                  type="button"
                  onClick={() => setSelectedIcon(option.emoji)}
                  className={`p-3 text-2xl rounded-lg border-2 transition-all hover:scale-105 ${
                    selectedIcon === option.emoji
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                  title={option.label}
                >
                  {option.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Goal Name */}
          <div className="space-y-2">
            <Label htmlFor="goal-name">What are they saving for?</Label>
            <Input
              id="goal-name"
              placeholder="e.g., New Trainers, Nintendo Switch, Holiday Spending"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Target Amount */}
          <div className="space-y-2">
            <Label htmlFor="target-amount">Target Amount (£)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
              <Input
                id="target-amount"
                type="number"
                placeholder="50.00"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="pl-7"
                step="0.01"
                min="0.01"
                max="100000"
              />
            </div>
            {errors.target_amount && (
              <p className="text-sm text-destructive">{errors.target_amount}</p>
            )}
          </div>

          {/* Preview */}
          {name && targetAmount && (
            <div className="p-4 bg-secondary/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Preview</p>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedIcon}</span>
                <div>
                  <p className="font-medium text-foreground">{name}</p>
                  <p className="text-sm text-primary font-semibold">
                    Goal: £{parseFloat(targetAmount || "0").toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full"
            disabled={createGoalMutation.isPending}
          >
            {createGoalMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Goal...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Create Savings Goal
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
