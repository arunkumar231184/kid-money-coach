import { Card } from "@/components/ui/card";
import { AddChildDialog } from "@/components/AddChildDialog";
import { Users } from "lucide-react";

interface EmptyKidsStateProps {
  onChildAdded?: () => void;
}

export function EmptyKidsState({ onChildAdded }: EmptyKidsStateProps) {
  return (
    <Card className="p-8 text-center border-dashed border-2">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
        <Users className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        No children added yet
      </h3>
      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
        Add your first child to start tracking their spending and setting up fun financial challenges.
      </p>
      <AddChildDialog onChildAdded={onChildAdded} />
    </Card>
  );
}
