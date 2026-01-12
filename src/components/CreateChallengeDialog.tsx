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
import { Card } from "@/components/ui/card";
import { useCreateChallenge } from "@/hooks/useChallenges";
import { Kid } from "@/hooks/useKids";
import { toast } from "sonner";
import { 
  Plus, 
  Loader2, 
  Cookie, 
  PiggyBank, 
  ShoppingBag, 
  Coins,
  Target,
  ArrowLeft,
  Check,
  Trophy
} from "lucide-react";
import { addDays, format } from "date-fns";

// Challenge templates
const challengeTemplates = [
  {
    id: "snack_tracker",
    icon: Cookie,
    title: "Snack Tracker",
    description: "Keep snack spending under a budget",
    defaultTarget: 10,
    defaultDays: 7,
    unit: "£",
    rewardXp: 50,
    rewardBadge: "Snack Master",
    color: "text-orange-500",
    bgColor: "bg-orange-50",
  },
  {
    id: "save_percentage",
    icon: PiggyBank,
    title: "Save 50%",
    description: "Save half of your allowance",
    defaultTarget: 50,
    defaultDays: 7,
    unit: "%",
    rewardXp: 75,
    rewardBadge: "Super Saver",
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    id: "no_impulse",
    icon: ShoppingBag,
    title: "No Impulse Buys",
    description: "Go without unplanned purchases",
    defaultTarget: 3,
    defaultDays: 3,
    unit: "days",
    rewardXp: 60,
    rewardBadge: "Self Control",
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
  {
    id: "round_ups",
    icon: Coins,
    title: "Round-Ups",
    description: "Round up purchases to save spare change",
    defaultTarget: 5,
    defaultDays: 14,
    unit: "£",
    rewardXp: 40,
    rewardBadge: "Penny Pincher",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    id: "savings_goal",
    icon: Target,
    title: "Savings Goal",
    description: "Save for something special",
    defaultTarget: 25,
    defaultDays: 30,
    unit: "£",
    rewardXp: 100,
    rewardBadge: "Goal Getter",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

const challengeSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters").max(50, "Title too long"),
  description: z.string().trim().max(200, "Description too long").optional(),
  target_value: z.number().min(1, "Target must be at least 1").max(10000, "Target too high"),
  target_days: z.number().min(1, "Duration must be at least 1 day").max(365, "Duration too long"),
});

type ChallengeFormData = z.infer<typeof challengeSchema>;

interface CreateChallengeDialogProps {
  kid: Kid;
  onChallengeCreated?: () => void;
  trigger?: React.ReactNode;
}

export function CreateChallengeDialog({ kid, onChallengeCreated, trigger }: CreateChallengeDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"select" | "customize">("select");
  const [selectedTemplate, setSelectedTemplate] = useState<typeof challengeTemplates[0] | null>(null);
  
  const createChallengeMutation = useCreateChallenge();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ChallengeFormData>({
    resolver: zodResolver(challengeSchema),
  });

  const handleSelectTemplate = (template: typeof challengeTemplates[0]) => {
    setSelectedTemplate(template);
    
    // Set default values based on template
    let defaultTitle = template.title;
    let defaultDescription = template.description;
    
    if (template.id === "snack_tracker") {
      defaultTitle = `Snack Budget £${template.defaultTarget}`;
      defaultDescription = `Keep snacks under £${template.defaultTarget} this week`;
    } else if (template.id === "save_percentage") {
      defaultTitle = "Save 50% This Week";
      defaultDescription = "Put aside half of your allowance";
    } else if (template.id === "no_impulse") {
      defaultTitle = `No Impulse Buys (${template.defaultDays} days)`;
      defaultDescription = `Go ${template.defaultDays} days without unplanned purchases`;
    } else if (template.id === "round_ups") {
      defaultTitle = `Round-Up £${template.defaultTarget}`;
      defaultDescription = `Save £${template.defaultTarget} in spare change`;
    } else if (template.id === "savings_goal") {
      defaultTitle = "Savings Goal";
      defaultDescription = "Save for something special";
    }

    setValue("title", defaultTitle);
    setValue("description", defaultDescription);
    setValue("target_value", template.defaultTarget);
    setValue("target_days", template.defaultDays);
    
    setStep("customize");
  };

  const handleBack = () => {
    setStep("select");
    setSelectedTemplate(null);
  };

  const onSubmit = async (data: ChallengeFormData) => {
    if (!selectedTemplate) return;

    try {
      const endDate = addDays(new Date(), data.target_days);
      
      await createChallengeMutation.mutateAsync({
        kid_id: kid.id,
        title: data.title.trim(),
        description: data.description?.trim() || "",
        type: selectedTemplate.id,
        target_value: data.target_value,
        target_days: data.target_days,
        reward_xp: selectedTemplate.rewardXp,
        reward_badge: selectedTemplate.rewardBadge,
        end_date: endDate.toISOString(),
      });

      toast.success(`Challenge created for ${kid.name}!`);
      handleClose();
      onChallengeCreated?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to create challenge");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setStep("select");
    setSelectedTemplate(null);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) handleClose();
      else setOpen(true);
    }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="text-primary">
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step === "customize" && (
              <Button variant="ghost" size="icon" className="h-8 w-8 mr-1" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <Trophy className="w-5 h-5 text-primary" />
            {step === "select" ? "Choose a Challenge" : "Customize Challenge"}
          </DialogTitle>
          <DialogDescription>
            {step === "select" 
              ? `Pick a challenge template for ${kid.name}` 
              : "Adjust the details to fit your goals"}
          </DialogDescription>
        </DialogHeader>

        {step === "select" ? (
          <div className="grid gap-3 mt-4">
            {challengeTemplates.map((template) => (
              <Card
                key={template.id}
                className="p-4 cursor-pointer hover:border-primary hover:shadow-md transition-all"
                onClick={() => handleSelectTemplate(template)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${template.bgColor} flex items-center justify-center`}>
                    <template.icon className={`w-6 h-6 ${template.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{template.title}</h4>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </div>
                  <div className="text-right text-sm">
                    <span className="text-primary font-medium">+{template.rewardXp} XP</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            {/* Selected template preview */}
            {selectedTemplate && (
              <div className={`p-3 rounded-lg ${selectedTemplate.bgColor} flex items-center gap-3`}>
                <selectedTemplate.icon className={`w-5 h-5 ${selectedTemplate.color}`} />
                <span className="font-medium text-foreground">{selectedTemplate.title}</span>
                <span className="ml-auto text-sm text-muted-foreground">+{selectedTemplate.rewardXp} XP</span>
              </div>
            )}

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Challenge Title</Label>
              <Input
                id="title"
                {...register("title")}
                className={errors.title ? "border-destructive" : ""}
                disabled={createChallengeMutation.isPending}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                {...register("description")}
                placeholder="What's this challenge about?"
                disabled={createChallengeMutation.isPending}
              />
            </div>

            {/* Target value */}
            <div className="space-y-2">
              <Label htmlFor="target_value">
                Target {selectedTemplate?.unit === "%" ? "Percentage" : selectedTemplate?.unit === "days" ? "Days" : "Amount (£)"}
              </Label>
              <Input
                id="target_value"
                type="number"
                min={1}
                step={selectedTemplate?.unit === "£" ? 0.5 : 1}
                {...register("target_value", { valueAsNumber: true })}
                className={errors.target_value ? "border-destructive" : ""}
                disabled={createChallengeMutation.isPending}
              />
              {errors.target_value && (
                <p className="text-sm text-destructive">{errors.target_value.message}</p>
              )}
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="target_days">Duration (days)</Label>
              <Input
                id="target_days"
                type="number"
                min={1}
                max={365}
                {...register("target_days", { valueAsNumber: true })}
                className={errors.target_days ? "border-destructive" : ""}
                disabled={createChallengeMutation.isPending}
              />
              {errors.target_days && (
                <p className="text-sm text-destructive">{errors.target_days.message}</p>
              )}
            </div>

            {/* Submit buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleClose}
                disabled={createChallengeMutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1" 
                disabled={createChallengeMutation.isPending}
              >
                {createChallengeMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Create Challenge
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
