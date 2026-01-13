import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChallengeCard } from "@/components/ChallengeCard";
import { InsightCard } from "@/components/InsightCard";
import { AchievementBadge } from "@/components/AchievementBadge";
import { ChildCard } from "@/components/ChildCard";
import { EmptyKidsState } from "@/components/EmptyKidsState";
import { AddChildDialog } from "@/components/AddChildDialog";
import { CreateChallengeDialog } from "@/components/CreateChallengeDialog";
import { CreateSavingsGoalDialog } from "@/components/CreateSavingsGoalDialog";
import { SavingsGoalCard } from "@/components/SavingsGoalCard";
import { useKids, useDeleteKid } from "@/hooks/useKids";
import { useActiveChallenges, useDeleteChallenge } from "@/hooks/useChallenges";
import { useSavingsGoals, useDeleteSavingsGoal } from "@/hooks/useSavingsGoals";
import { useAuth } from "@/contexts/AuthContext";
import { 
  User, 
  Bell, 
  Settings, 
  Plus,
  Loader2,
  LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { differenceInDays } from "date-fns";

import type { ChallengeType, ChallengeStatus } from "@/components/ChallengeCard";

// Map challenge types to ChallengeCard types
const challengeTypeMap: Record<string, ChallengeType> = {
  snack_tracker: "snack-tracker",
  save_percentage: "save-allowance",
  no_impulse: "no-impulse",
  round_ups: "round-ups",
  savings_goal: "goal",
};

export function ParentDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: kids, isLoading, refetch } = useKids();
  const deleteKidMutation = useDeleteKid();
  const deleteChallengesMutation = useDeleteChallenge();

  const selectedKid = kids?.[0]; // For now, show first kid's data
  const { data: activeChallenges, refetch: refetchChallenges } = useActiveChallenges(selectedKid?.id);
  const { data: savingsGoals, refetch: refetchSavingsGoals } = useSavingsGoals(selectedKid?.id);
  const deleteSavingsGoalMutation = useDeleteSavingsGoal();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleDeleteKid = async (kidId: string) => {
    try {
      await deleteKidMutation.mutateAsync(kidId);
      toast.success("Child removed successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to remove child");
    }
  };

  const handleChildAdded = () => {
    refetch();
  };

  const handleChallengeCreated = () => {
    refetchChallenges();
  };

  const handleSavingsGoalCreated = () => {
    refetchSavingsGoals();
  };

  const handleDeleteSavingsGoal = async (goalId: string) => {
    if (!selectedKid) return;
    try {
      await deleteSavingsGoalMutation.mutateAsync({ id: goalId, kidId: selectedKid.id });
      toast.success("Savings goal removed");
    } catch (error: any) {
      toast.error(error.message || "Failed to remove savings goal");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Good morning</p>
              <p className="font-semibold text-foreground">
                {user?.user_metadata?.full_name || "Parent"}'s Dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Children section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Your Children</h3>
            {kids && kids.length > 0 && (
              <AddChildDialog onChildAdded={handleChildAdded} />
            )}
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : kids && kids.length > 0 ? (
            <div className="space-y-4">
              {kids.map((kid) => (
                <ChildCard
                  key={kid.id}
                  kid={kid}
                  onDelete={handleDeleteKid}
                  isDeleting={deleteKidMutation.isPending}
                />
              ))}
            </div>
          ) : (
            <EmptyKidsState onChildAdded={handleChildAdded} />
          )}
        </section>

        {/* Show detailed sections only if there are kids */}
        {selectedKid && (
          <>
            {/* Weekly insight */}
            <InsightCard 
              title="Weekly Insight"
              message={activeChallenges && activeChallenges.length > 0 
                ? `${selectedKid.name} has ${activeChallenges.length} active challenge${activeChallenges.length > 1 ? 's' : ''}. Keep encouraging them!`
                : "Create your first challenge to start building great money habits!"}
              trend="neutral"
              category="Getting Started"
              actionLabel="Learn more"
            />
            
            {/* Active challenges */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Active Challenges</h3>
                <CreateChallengeDialog 
                  kid={selectedKid} 
                  onChallengeCreated={handleChallengeCreated}
                />
              </div>
              
              {activeChallenges && activeChallenges.length > 0 ? (
                <div className="space-y-3">
                  {activeChallenges.map((challenge) => {
                    const daysLeft = challenge.end_date 
                      ? Math.max(0, differenceInDays(new Date(challenge.end_date), new Date()))
                      : challenge.target_days ?? 7;
                    
                    return (
                      <ChallengeCard
                        key={challenge.id}
                        type={challengeTypeMap[challenge.type] || "goal"}
                        title={challenge.title}
                        description={challenge.description || ""}
                        progress={Number(challenge.current_value) || 0}
                        target={Number(challenge.target_value)}
                        status={(challenge.status as ChallengeStatus) || "active"}
                        daysLeft={daysLeft}
                      />
                    );
                  })}
                </div>
              ) : (
                <Card className="p-6 text-center border-dashed border-2">
                  <p className="text-muted-foreground">
                    No active challenges yet. Create one to help {selectedKid.name} build better money habits!
                  </p>
                  <CreateChallengeDialog 
                    kid={selectedKid}
                    onChallengeCreated={handleChallengeCreated}
                    trigger={
                      <Button variant="outline" className="mt-4">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Challenge
                      </Button>
                    }
                  />
                </Card>
              )}
            </section>
            
            {/* Savings goals */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Savings Goals</h3>
                <CreateSavingsGoalDialog 
                  kid={selectedKid} 
                  onGoalCreated={handleSavingsGoalCreated}
                />
              </div>
              
              {savingsGoals && savingsGoals.length > 0 ? (
                <div className="space-y-3">
                  {savingsGoals.map((goal) => (
                    <SavingsGoalCard
                      key={goal.id}
                      goal={goal}
                      onDelete={handleDeleteSavingsGoal}
                      isDeleting={deleteSavingsGoalMutation.isPending}
                    />
                  ))}
                </div>
              ) : (
                <Card className="p-6 text-center border-dashed border-2">
                  <p className="text-muted-foreground">
                    No savings goals yet. Help {selectedKid.name} save for something special!
                  </p>
                  <CreateSavingsGoalDialog 
                    kid={selectedKid}
                    onGoalCreated={handleSavingsGoalCreated}
                    trigger={
                      <Button variant="outline" className="mt-4">
                        <Plus className="w-4 h-4 mr-2" />
                        Set Goal
                      </Button>
                    }
                  />
                </Card>
              )}
            </section>
            
            {/* Badges earned */}
            <section>
              <h3 className="text-lg font-semibold text-foreground mb-4">{selectedKid.name}'s Badges</h3>
              <div className="flex gap-4 overflow-x-auto pb-2">
                <AchievementBadge type="first-week" earned={false} />
                <AchievementBadge type="streak" earned={false} />
                <AchievementBadge type="saver" earned={false} />
                <AchievementBadge type="goal" earned={false} />
              </div>
            </section>
            
            {/* Recent transactions */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
                <Button variant="ghost" size="sm" className="text-primary">
                  View all
                </Button>
              </div>
              <Card className="p-6 text-center border-dashed border-2">
                <p className="text-muted-foreground">
                  No transactions yet. Connect a bank account or add transactions manually.
                </p>
                <Button variant="outline" className="mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Transaction
                </Button>
              </Card>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
