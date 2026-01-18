import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AchievementBadge } from "@/components/AchievementBadge";
import { CategoryBadge } from "@/components/CategoryBadge";
import { 
  Sparkles, 
  Target, 
  Flame,
  Star,
  ArrowLeft,
  Gift,
  Zap,
  Loader2,
  Wallet,
  TrendingDown,
  TrendingUp,
  PiggyBank
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useKid } from "@/hooks/useKids";
import { useActiveChallenges } from "@/hooks/useChallenges";
import { useSavingsGoals } from "@/hooks/useSavingsGoals";
import { useBadges } from "@/hooks/useBadges";
import { useTransactions } from "@/hooks/useTransactions";
import { useSpendingInsights } from "@/hooks/useSpendingInsights";
import { format } from "date-fns";

// Badge type mapping from database icons to AchievementBadge types
const badgeTypeMap: Record<string, "saver" | "streak" | "goal" | "first-week" | "challenge-master"> = {
  "coins": "saver",
  "flame": "streak", 
  "target": "goal",
  "star": "first-week",
  "trophy": "challenge-master",
};

// Calculate XP needed for each level
const getXpForLevel = (level: number) => level * 100;

// Challenge color mapping
const challengeColors: Record<string, string> = {
  "snack_tracker": "from-orange-400 to-amber-500",
  "save_percentage": "from-emerald-400 to-teal-500",
  "no_impulse": "from-purple-400 to-violet-500",
  "round_ups": "from-blue-400 to-cyan-500",
  "savings_goal": "from-pink-400 to-rose-500",
};

const challengeEmojis: Record<string, string> = {
  "snack_tracker": "🍿",
  "save_percentage": "💰",
  "no_impulse": "🎯",
  "round_ups": "🔄",
  "savings_goal": "⭐",
};

// All available badge types
const allBadgeTypes: Array<"saver" | "streak" | "goal" | "first-week" | "challenge-master"> = [
  "first-week",
  "streak",
  "saver",
  "goal",
  "challenge-master",
];

const avatarEmojis = ["👦", "👧", "🧒", "👶", "🧑"];

type Category = "snacks" | "gaming" | "fashion" | "transport" | "savings" | "other";

function mapCategory(category: string): Category {
  const lower = category.toLowerCase();
  if (lower.includes("snack") || lower.includes("food")) return "snacks";
  if (lower.includes("gaming") || lower.includes("game")) return "gaming";
  if (lower.includes("fashion") || lower.includes("shop")) return "fashion";
  if (lower.includes("transport")) return "transport";
  if (lower.includes("saving")) return "savings";
  return "other";
}

export default function KidView() {
  const { kidId } = useParams<{ kidId: string }>();
  
  const { data: kid, isLoading: isLoadingKid } = useKid(kidId);
  const { data: challenges = [], isLoading: isLoadingChallenges } = useActiveChallenges(kidId);
  const { data: savingsGoals = [], isLoading: isLoadingSavings } = useSavingsGoals(kidId);
  const { data: earnedBadges = [], isLoading: isLoadingBadges } = useBadges(kidId);
  const { data: transactions = [], isLoading: isLoadingTransactions } = useTransactions(kidId, 50);

  const spendingInsights = useSpendingInsights(transactions);
  const isLoading = isLoadingKid || isLoadingChallenges || isLoadingSavings || isLoadingBadges || isLoadingTransactions;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-light via-background to-accent-light flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!kid) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-light via-background to-accent-light flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-muted-foreground">Kid not found</p>
        <Link to="/dashboard">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const avatarEmoji = avatarEmojis[kid.name.charCodeAt(0) % avatarEmojis.length];
  const xpToNext = getXpForLevel(kid.level ?? 1);
  const xpPercentage = ((kid.xp_points ?? 0) / xpToNext) * 100;
  
  // Get the first active savings goal
  const primarySavingsGoal = savingsGoals[0];
  const savingsPercentage = primarySavingsGoal 
    ? ((primarySavingsGoal.current_amount ?? 0) / primarySavingsGoal.target_amount) * 100 
    : 0;

  // Map earned badges by icon type
  const earnedBadgeIcons = new Set(earnedBadges.map(b => b.icon.toLowerCase()));

  // Create badge display list with earned status
  const badgeDisplay = allBadgeTypes.map(type => {
    const iconKey = type === "first-week" ? "star" : 
                    type === "challenge-master" ? "trophy" :
                    type === "streak" ? "flame" :
                    type === "goal" ? "target" : "coins";
    return {
      type,
      earned: earnedBadgeIcons.has(iconKey),
      count: type === "streak" ? (kid.current_streak ?? 0) : undefined,
    };
  });

  const totalEarnedBadges = badgeDisplay.filter(b => b.earned).length;
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light via-background to-accent-light pb-safe">
      {/* Header - Mobile optimized */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-white/80 border-b border-border safe-top">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-accent" />
            <span className="font-bold text-accent">{kid.current_streak ?? 0} day streak!</span>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6 max-w-lg mx-auto">
        {/* Welcome Card - Compact for mobile */}
        <Card className="p-5 bg-gradient-to-br from-primary via-primary to-primary-dark text-primary-foreground overflow-hidden relative">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-4xl shadow-lg">
              {avatarEmoji}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold truncate">Hey {kid.name}! 👋</h1>
              
              {/* Level progress - inline */}
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    Level {kid.level ?? 1}
                  </span>
                  <span>{kid.xp_points ?? 0}/{xpToNext} XP</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-badge-gold to-yellow-300 rounded-full transition-all duration-700"
                    style={{ width: `${xpPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Stats - Horizontal scroll on mobile */}
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x">
          <Card className="p-4 text-center bg-success-light border-success/20 min-w-[100px] snap-start shrink-0">
            <div className="text-2xl mb-1">🏆</div>
            <p className="text-xl font-bold text-success">{kid.total_badges ?? 0}</p>
            <p className="text-xs text-muted-foreground">Badges</p>
          </Card>
          <Card className="p-4 text-center bg-accent-light border-accent/20 min-w-[100px] snap-start shrink-0">
            <div className="text-2xl mb-1">🔥</div>
            <p className="text-xl font-bold text-accent">{kid.current_streak ?? 0}</p>
            <p className="text-xs text-muted-foreground">Streak</p>
          </Card>
          <Card className="p-4 text-center bg-primary-light border-primary/20 min-w-[100px] snap-start shrink-0">
            <div className="text-2xl mb-1">⭐</div>
            <p className="text-xl font-bold text-primary">{kid.level ?? 1}</p>
            <p className="text-xs text-muted-foreground">Level</p>
          </Card>
          <Card className="p-4 text-center bg-warning-light border-warning/20 min-w-[100px] snap-start shrink-0">
            <div className="text-2xl mb-1">💷</div>
            <p className="text-xl font-bold text-warning-foreground">£{spendingInsights.weeklyStats.totalSpent.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground">This Week</p>
          </Card>
        </div>

        {/* My Spending - Kid-friendly view */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Wallet className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">My Spending</h2>
          </div>
          
          <Card className="p-4">
            {spendingInsights.categoryBreakdown.length > 0 ? (
              <div className="space-y-3">
                {spendingInsights.categoryBreakdown.slice(0, 4).map((cat, idx) => (
                  <div key={cat.category} className="flex items-center gap-3">
                    <span className="text-2xl">{cat.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm text-foreground">{cat.label}</span>
                        <span className="font-semibold text-foreground">£{cat.amount.toFixed(2)}</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all"
                          style={{ 
                            width: `${cat.percentage}%`,
                            backgroundColor: cat.color 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Insight tip for kids */}
                {spendingInsights.insights[0] && (
                  <div className="mt-4 p-3 bg-primary-light rounded-lg">
                    <p className="text-sm font-medium text-foreground">
                      💡 {spendingInsights.insights[0].message}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No spending recorded yet!
              </p>
            )}
          </Card>
        </section>

        {/* Recent Transactions - Compact list */}
        {recentTransactions.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-muted-foreground" />
                <h2 className="text-lg font-bold text-foreground">Recent</h2>
              </div>
              <span className="text-xs text-muted-foreground">{transactions.length} total</span>
            </div>
            
            <Card className="divide-y divide-border">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="p-3 flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                    tx.is_income ? "bg-success-light" : "bg-secondary"
                  )}>
                    {tx.is_income ? (
                      <TrendingUp className="w-5 h-5 text-success" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">{tx.merchant}</p>
                    <div className="flex items-center gap-2">
                      <CategoryBadge category={mapCategory(tx.category)} />
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(tx.transaction_date), "MMM d")}
                      </span>
                    </div>
                  </div>
                  <span className={cn(
                    "font-semibold text-sm shrink-0",
                    tx.is_income ? "text-success" : "text-foreground"
                  )}>
                    {tx.is_income ? "+" : "-"}£{Math.abs(tx.amount).toFixed(2)}
                  </span>
                </div>
              ))}
            </Card>
          </section>
        )}

        {/* Savings Goal */}
        {primarySavingsGoal ? (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <PiggyBank className="w-5 h-5 text-success" />
              <h2 className="text-lg font-bold text-foreground">My Savings Goal</h2>
            </div>
            
            <Card className="p-5 bg-gradient-to-br from-success-light to-emerald-100 border-success/20 relative overflow-hidden">
              <div className="absolute top-2 right-2 text-5xl opacity-20">
                {primarySavingsGoal.icon}
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-xl bg-success/20 flex items-center justify-center text-3xl">
                  {primarySavingsGoal.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">{primarySavingsGoal.name}</h3>
                  <p className="text-xs text-muted-foreground">Keep saving!</p>
                </div>
              </div>
              
              {/* Progress */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold text-success">£{(primarySavingsGoal.current_amount ?? 0).toFixed(2)}</span>
                  <span className="text-muted-foreground">£{primarySavingsGoal.target_amount.toFixed(2)}</span>
                </div>
                <div className="h-6 bg-white rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-success via-emerald-400 to-teal-400 rounded-full flex items-center justify-end pr-2 transition-all duration-1000"
                    style={{ width: `${Math.max(savingsPercentage, 15)}%` }}
                  >
                    <span className="text-xs font-bold text-white">{savingsPercentage.toFixed(0)}%</span>
                  </div>
                </div>
                <p className="text-center text-xs text-muted-foreground mt-2">
                  <span className="font-semibold text-success">
                    £{(primarySavingsGoal.target_amount - (primarySavingsGoal.current_amount ?? 0)).toFixed(2)}
                  </span> to go! 💪
                </p>
              </div>
            </Card>
          </section>
        ) : (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">My Savings Goal</h2>
            </div>
            <Card className="p-5 text-center text-muted-foreground">
              <PiggyBank className="w-10 h-10 mx-auto mb-2 text-muted-foreground/50" />
              <p className="text-sm">No savings goal yet. Ask your parent to help you set one!</p>
            </Card>
          </section>
        )}

        {/* Active Challenges - Compact cards */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-bold text-foreground">My Challenges</h2>
            {challenges.length > 0 && (
              <span className="ml-auto text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium">
                {challenges.length} active
              </span>
            )}
          </div>
          
          {challenges.length > 0 ? (
            <div className="space-y-3">
              {challenges.map((challenge, index) => {
                const color = challengeColors[challenge.type] || "from-primary to-teal-400";
                const emoji = challengeEmojis[challenge.type] || "🎯";
                const progress = Number(challenge.current_value) || 0;
                const target = Number(challenge.target_value) || 1;
                const progressPercent = Math.min((progress / target) * 100, 100);
                const daysLeft = challenge.end_date 
                  ? Math.max(0, Math.ceil((new Date(challenge.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
                  : challenge.target_days ?? 7;

                return (
                  <Card 
                    key={challenge.id} 
                    className={cn(
                      "p-4 border-2 overflow-hidden relative animate-fade-in",
                      progress >= target 
                        ? "border-success bg-success-light" 
                        : "border-border"
                    )}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br shadow-md shrink-0",
                        color
                      )}>
                        {emoji}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-bold text-foreground text-sm truncate">{challenge.title}</h3>
                          <span className="flex items-center gap-1 text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium shrink-0">
                            <Flame className="w-3 h-3" />
                            {daysLeft}d
                          </span>
                        </div>
                        
                        <div className="mt-2">
                          <div className="h-3 bg-secondary rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                "h-full rounded-full transition-all duration-700 bg-gradient-to-r",
                                color
                              )}
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {progressPercent.toFixed(0)}% complete
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="p-5 text-center text-muted-foreground">
              <Zap className="w-10 h-10 mx-auto mb-2 text-muted-foreground/50" />
              <p className="text-sm">No challenges yet. Ask your parent to create one!</p>
            </Card>
          )}
        </section>

        {/* Badges Collection - Horizontal scroll */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-badge-gold" />
              <h2 className="text-lg font-bold text-foreground">My Badges</h2>
            </div>
            <span className="text-xs text-muted-foreground">{totalEarnedBadges}/{allBadgeTypes.length}</span>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x">
            {badgeDisplay.map((badge, index) => (
              <div 
                key={badge.type} 
                className="animate-fade-in snap-start shrink-0"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <AchievementBadge 
                  type={badge.type} 
                  earned={badge.earned} 
                  count={badge.count}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Motivational Footer */}
        <Card className="p-5 bg-gradient-to-r from-accent via-orange-400 to-amber-400 text-white text-center relative overflow-hidden">
          <div className="absolute -top-4 -left-4 text-5xl opacity-20">🎯</div>
          <div className="absolute -bottom-4 -right-4 text-5xl opacity-20">🌟</div>
          
          <div className="relative z-10">
            <Gift className="w-10 h-10 mx-auto mb-2" />
            <h3 className="text-lg font-bold mb-1">Keep Going!</h3>
            <p className="text-sm text-white/90">
              Complete challenges to earn badges and level up! 🚀
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
}
