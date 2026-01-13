import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AchievementBadge } from "@/components/AchievementBadge";
import { 
  Sparkles, 
  Target, 
  Flame,
  Star,
  ArrowLeft,
  Gift,
  Zap,
  Loader2
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useKid } from "@/hooks/useKids";
import { useActiveChallenges } from "@/hooks/useChallenges";
import { useSavingsGoals } from "@/hooks/useSavingsGoals";
import { useBadges } from "@/hooks/useBadges";

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
  "snack-tracker": "from-orange-400 to-amber-500",
  "save-50": "from-emerald-400 to-teal-500",
  "no-impulse": "from-purple-400 to-violet-500",
  "round-ups": "from-blue-400 to-cyan-500",
  "custom-goal": "from-pink-400 to-rose-500",
};

const challengeEmojis: Record<string, string> = {
  "snack-tracker": "🍿",
  "save-50": "💰",
  "no-impulse": "🎯",
  "round-ups": "🔄",
  "custom-goal": "⭐",
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

export default function KidView() {
  const { kidId } = useParams<{ kidId: string }>();
  
  const { data: kid, isLoading: isLoadingKid } = useKid(kidId);
  const { data: challenges = [], isLoading: isLoadingChallenges } = useActiveChallenges(kidId);
  const { data: savingsGoals = [], isLoading: isLoadingSavings } = useSavingsGoals(kidId);
  const { data: earnedBadges = [], isLoading: isLoadingBadges } = useBadges(kidId);

  const isLoading = isLoadingKid || isLoadingChallenges || isLoadingSavings || isLoadingBadges;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-light via-background to-accent-light flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!kid) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-light via-background to-accent-light flex flex-col items-center justify-center gap-4">
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light via-background to-accent-light">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-white/80 border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
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

      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* Welcome Card */}
        <Card className="p-6 bg-gradient-to-br from-primary via-primary to-primary-dark text-primary-foreground overflow-hidden relative">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/10 rounded-full blur-xl" />
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-5xl shadow-lg animate-bounce-gentle">
              {avatarEmoji}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Hey {kid.name}! 👋</h1>
              <p className="text-primary-foreground/80 mt-1">You're doing amazing!</p>
              
              {/* Level progress */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current" />
                    Level {kid.level ?? 1}
                  </span>
                  <span>{kid.xp_points ?? 0} / {xpToNext} XP</span>
                </div>
                <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-badge-gold to-yellow-300 rounded-full transition-all duration-700"
                    style={{ width: `${xpPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 text-center bg-success-light border-success/20">
            <div className="text-3xl mb-1">🏆</div>
            <p className="text-2xl font-bold text-success">{kid.total_badges ?? 0}</p>
            <p className="text-xs text-muted-foreground">Badges</p>
          </Card>
          <Card className="p-4 text-center bg-accent-light border-accent/20">
            <div className="text-3xl mb-1">🔥</div>
            <p className="text-2xl font-bold text-accent">{kid.current_streak ?? 0}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </Card>
          <Card className="p-4 text-center bg-primary-light border-primary/20">
            <div className="text-3xl mb-1">⭐</div>
            <p className="text-2xl font-bold text-primary">{kid.level ?? 1}</p>
            <p className="text-xs text-muted-foreground">Level</p>
          </Card>
        </div>

        {/* Savings Goal - Big Visual */}
        {primarySavingsGoal ? (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-foreground">My Savings Goal</h2>
            </div>
            
            <Card className="p-6 bg-gradient-to-br from-success-light to-emerald-100 border-success/20 relative overflow-hidden">
              <div className="absolute top-4 right-4 text-6xl opacity-20 animate-float">
                {primarySavingsGoal.icon}
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-success/20 flex items-center justify-center text-4xl">
                  {primarySavingsGoal.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{primarySavingsGoal.name}</h3>
                  <p className="text-sm text-muted-foreground">Keep saving!</p>
                </div>
              </div>
              
              {/* Thermometer */}
              <div className="relative">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-foreground">£{(primarySavingsGoal.current_amount ?? 0).toFixed(2)}</span>
                  <span className="font-medium text-muted-foreground">£{primarySavingsGoal.target_amount.toFixed(2)}</span>
                </div>
                <div className="h-8 bg-white rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-success via-emerald-400 to-teal-400 rounded-full relative transition-all duration-1000 flex items-center justify-end pr-2"
                    style={{ width: `${Math.max(savingsPercentage, 10)}%` }}
                  >
                    <span className="text-xs font-bold text-white">{savingsPercentage.toFixed(0)}%</span>
                  </div>
                </div>
                <p className="text-center text-sm text-muted-foreground mt-3">
                  <span className="font-semibold text-success">
                    £{(primarySavingsGoal.target_amount - (primarySavingsGoal.current_amount ?? 0)).toFixed(2)}
                  </span> more to go! You've got this! 💪
                </p>
              </div>
            </Card>
          </section>
        ) : (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-foreground">My Savings Goal</h2>
            </div>
            <Card className="p-6 text-center text-muted-foreground">
              <p>No savings goal set yet. Ask your parent to create one!</p>
            </Card>
          </section>
        )}

        {/* Active Challenges */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-6 h-6 text-accent" />
            <h2 className="text-xl font-bold text-foreground">My Challenges</h2>
          </div>
          
          {challenges.length > 0 ? (
            <div className="space-y-4">
              {challenges.map((challenge, index) => {
                const color = challengeColors[challenge.type] || "from-primary to-teal-400";
                const emoji = challengeEmojis[challenge.type] || "🎯";
                const progress = Number(challenge.current_value) || 0;
                const target = Number(challenge.target_value) || 1;
                const daysLeft = challenge.end_date 
                  ? Math.max(0, Math.ceil((new Date(challenge.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
                  : challenge.target_days ?? 7;

                return (
                  <Card 
                    key={challenge.id} 
                    className={cn(
                      "p-5 border-2 overflow-hidden relative animate-fade-in",
                      progress >= target 
                        ? "border-success bg-success-light" 
                        : "border-primary/20"
                    )}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      {/* Emoji */}
                      <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center text-3xl bg-gradient-to-br shadow-lg",
                        color
                      )}>
                        {emoji}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-foreground text-lg">{challenge.title}</h3>
                          <span className="flex items-center gap-1 text-sm bg-accent/10 text-accent px-2 py-1 rounded-full font-medium">
                            <Flame className="w-4 h-4" />
                            {daysLeft}d
                          </span>
                        </div>
                        
                        {/* Progress bar */}
                        <div className="mt-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-bold text-foreground">
                              {challenge.type === "snack-tracker" || challenge.type === "save-50" 
                                ? `£${progress.toFixed(2)}` 
                                : progress} / {challenge.type === "snack-tracker" || challenge.type === "save-50" 
                                ? `£${target.toFixed(2)}` 
                                : target}
                            </span>
                          </div>
                          <div className="h-4 bg-secondary rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                "h-full rounded-full transition-all duration-700 bg-gradient-to-r",
                                color
                              )}
                              style={{ width: `${Math.min((progress / target) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="p-6 text-center text-muted-foreground">
              <p>No active challenges. Ask your parent to create one!</p>
            </Card>
          )}
        </section>

        {/* Badges Collection */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-badge-gold" />
              <h2 className="text-xl font-bold text-foreground">My Badges</h2>
            </div>
            <span className="text-sm text-muted-foreground">{totalEarnedBadges}/{allBadgeTypes.length} earned</span>
          </div>
          
          <Card className="p-6">
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
              {badgeDisplay.map((badge, index) => (
                <div 
                  key={badge.type} 
                  className="animate-fade-in"
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
          </Card>
        </section>

        {/* Motivational CTA */}
        <Card className="p-6 bg-gradient-to-r from-accent via-orange-400 to-amber-400 text-white text-center relative overflow-hidden">
          <div className="absolute -top-4 -left-4 text-6xl opacity-20">🎯</div>
          <div className="absolute -bottom-4 -right-4 text-6xl opacity-20">🌟</div>
          
          <div className="relative z-10">
            <Gift className="w-12 h-12 mx-auto mb-3 animate-bounce-gentle" />
            <h3 className="text-xl font-bold mb-2">Keep Going!</h3>
            <p className="text-white/90 mb-4">
              Complete your challenges to earn more badges and level up!
            </p>
            <Button variant="glass" size="lg">
              <Sparkles className="w-5 h-5 mr-2" />
              View All Rewards
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}
