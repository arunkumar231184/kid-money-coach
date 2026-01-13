import { Card } from "@/components/ui/card";
import { Kid } from "@/hooks/useKids";
import { 
  ChevronRight, 
  Wallet, 
  PiggyBank, 
  Sparkles,
  Trash2
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ChildCardProps {
  kid: Kid;
  onDelete?: (kidId: string) => void;
  isDeleting?: boolean;
}

const avatarEmojis = ["👦", "👧", "🧒", "👶", "🧑"];

export function ChildCard({ kid, onDelete, isDeleting }: ChildCardProps) {
  const avatarEmoji = avatarEmojis[kid.name.charCodeAt(0) % avatarEmojis.length];
  const frequencyLabel = kid.allowance_frequency === "weekly" ? "Weekly" : "Monthly";

  return (
    <Card className="p-5 hero-gradient text-primary-foreground relative overflow-hidden">
      <Link to={`/kid/${kid.id}`} className="block">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-2xl">
              {avatarEmoji}
            </div>
            <div>
              <h2 className="text-xl font-bold">{kid.name} ({kid.age})</h2>
              <p className="text-primary-foreground/80 text-sm">
                {kid.bank_account_connected ? "Bank connected" : "No bank connected"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              View Kid Mode
            </span>
            <ChevronRight className="w-6 h-6 text-primary-foreground/60" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-5">
          <div className="bg-white/10 backdrop-blur rounded-xl p-3">
            <div className="flex items-center gap-2 text-primary-foreground/80 text-sm">
              <Wallet className="w-4 h-4" />
              {frequencyLabel} Allowance
            </div>
            <p className="text-2xl font-bold mt-1">
              £{(kid.allowance_amount ?? 0).toFixed(2)}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-3">
            <div className="flex items-center gap-2 text-primary-foreground/80 text-sm">
              <PiggyBank className="w-4 h-4" />
              Total Saved
            </div>
            <p className="text-2xl font-bold mt-1">
              £{(kid.total_saved ?? 0).toFixed(2)}
            </p>
          </div>
        </div>
      </Link>

      {/* Delete button */}
      {onDelete && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 text-primary-foreground/60 hover:text-primary-foreground hover:bg-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove {kid.name}?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete {kid.name}'s profile, including all their transactions, challenges, and badges. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(kid.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={isDeleting}
              >
                {isDeleting ? "Removing..." : "Remove"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </Card>
  );
}
