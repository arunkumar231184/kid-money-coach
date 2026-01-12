import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Plus, Loader2, UserPlus } from "lucide-react";

const addChildSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  age: z
    .number()
    .min(1, "Age must be at least 1")
    .max(25, "Age must be 25 or less"),
  allowance_amount: z
    .number()
    .min(0, "Allowance cannot be negative")
    .max(1000, "Allowance cannot exceed £1000"),
  allowance_frequency: z.enum(["weekly", "monthly"]),
});

type AddChildFormData = z.infer<typeof addChildSchema>;

interface AddChildDialogProps {
  onChildAdded?: () => void;
}

export function AddChildDialog({ onChildAdded }: AddChildDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AddChildFormData>({
    resolver: zodResolver(addChildSchema),
    defaultValues: {
      name: "",
      age: 11,
      allowance_amount: 10,
      allowance_frequency: "weekly",
    },
  });

  const frequency = watch("allowance_frequency");

  const onSubmit = async (data: AddChildFormData) => {
    if (!user) {
      toast.error("You must be logged in to add a child");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.from("kids").insert({
        parent_id: user.id,
        name: data.name.trim(),
        age: data.age,
        allowance_amount: data.allowance_amount,
        allowance_frequency: data.allowance_frequency,
      });

      if (error) {
        throw error;
      }

      toast.success(`${data.name} has been added!`);
      reset();
      setOpen(false);
      onChildAdded?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to add child");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-dashed">
          <Plus className="w-4 h-4 mr-2" />
          Add Child
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            Add a Child
          </DialogTitle>
          <DialogDescription>
            Register your child to start tracking their spending and set up challenges.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Child's Name</Label>
            <Input
              id="name"
              placeholder="e.g. Alex"
              {...register("name")}
              className={errors.name ? "border-destructive" : ""}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Age */}
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              min={1}
              max={25}
              {...register("age", { valueAsNumber: true })}
              className={errors.age ? "border-destructive" : ""}
              disabled={isLoading}
            />
            {errors.age && (
              <p className="text-sm text-destructive">{errors.age.message}</p>
            )}
          </div>

          {/* Allowance Amount */}
          <div className="space-y-2">
            <Label htmlFor="allowance_amount">Allowance Amount (£)</Label>
            <Input
              id="allowance_amount"
              type="number"
              min={0}
              max={1000}
              step={0.5}
              {...register("allowance_amount", { valueAsNumber: true })}
              className={errors.allowance_amount ? "border-destructive" : ""}
              disabled={isLoading}
            />
            {errors.allowance_amount && (
              <p className="text-sm text-destructive">
                {errors.allowance_amount.message}
              </p>
            )}
          </div>

          {/* Allowance Frequency */}
          <div className="space-y-2">
            <Label>Allowance Frequency</Label>
            <Select
              value={frequency}
              onValueChange={(value: "weekly" | "monthly") =>
                setValue("allowance_frequency", value)
              }
              disabled={isLoading}
            >
              <SelectTrigger className={errors.allowance_frequency ? "border-destructive" : ""}>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
            {errors.allowance_frequency && (
              <p className="text-sm text-destructive">
                {errors.allowance_frequency.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Child
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
