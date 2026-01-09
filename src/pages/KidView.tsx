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
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

// Mock data for the kid
const kidData = {
  name: "Alex",
  avatar: "👦",
  streak: 3,
  totalBadges: 2,
  level: 4,
  xp: 340,
  xpToNext: 500,
};

const challenges = [
  { 
    id: 1, 
    title: "Save £5 This Week", 
    emoji: "💰", 
    progress: 3, 
    target: 7, 
    daysLeft: 4,
    color: "from-emerald-400 to-teal-500"
  },
  { 
    id: 2, 
    title: "Snack Budget £10", 
    emoji: "🍿", 
    progress: 6.70, 
    target: 10, 
    daysLeft: 4,
    color: "from-orange-400 to-amber-500"
  },
];

const savingsGoal = {
  name: "New Trainers",
  emoji: "👟",
  current: 12.50,
  target: 85,
  image: "Nike Air Max",
};

const badges = [
  { type: "first-week" as const, earned: true },
  { type: "streak" as const, earned: true, count: 3 },
  { type: "saver" as const, earned: false },
  { type: "goal" as const, earned: false },
  { type: "challenge-master" as const, earned: false },
];

export default function KidView() {
  const xpPercentage = (kidData.xp / kidData.xpToNext) * 100;
  const savingsPercentage = (savingsGoal.current / savingsGoal.target) * 100;

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
            <span className="font-bold text-accent">{kidData.streak} day streak!</span>
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
              {kidData.avatar}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Hey {kidData.name}! 👋</h1>
              <p className="text-primary-foreground/80 mt-1">You're doing amazing!</p>
              
              {/* Level progress */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current" />
                    Level {kidData.level}
                  </span>
                  <span>{kidData.xp} / {kidData.xpToNext} XP</span>
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
            <p className="text-2xl font-bold text-success">{kidData.totalBadges}</p>
            <p className="text-xs text-muted-foreground">Badges</p>
          </Card>
          <Card className="p-4 text-center bg-accent-light border-accent/20">
            <div className="text-3xl mb-1">🔥</div>
            <p className="text-2xl font-bold text-accent">{kidData.streak}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </Card>
          <Card className="p-4 text-center bg-primary-light border-primary/20">
            <div className="text-3xl mb-1">⭐</div>
            <p className="text-2xl font-bold text-primary">{kidData.level}</p>
            <p className="text-xs text-muted-foreground">Level</p>
          </Card>
        </div>

        {/* Savings Goal - Big Visual */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-foreground">My Savings Goal</h2>
          </div>
          
          <Card className="p-6 bg-gradient-to-br from-success-light to-emerald-100 border-success/20 relative overflow-hidden">
            <div className="absolute top-4 right-4 text-6xl opacity-20 animate-float">
              {savingsGoal.emoji}
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-success/20 flex items-center justify-center text-4xl">
                {savingsGoal.emoji}
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">{savingsGoal.name}</h3>
                <p className="text-sm text-muted-foreground">{savingsGoal.image}</p>
              </div>
            </div>
            
            {/* Thermometer */}
            <div className="relative">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-foreground">£{savingsGoal.current.toFixed(2)}</span>
                <span className="font-medium text-muted-foreground">£{savingsGoal.target}</span>
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
                <span className="font-semibold text-success">£{(savingsGoal.target - savingsGoal.current).toFixed(2)}</span> more to go! You've got this! 💪
              </p>
            </div>
          </Card>
        </section>

        {/* Active Challenges */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-6 h-6 text-accent" />
            <h2 className="text-xl font-bold text-foreground">My Challenges</h2>
          </div>
          
          <div className="space-y-4">
            {challenges.map((challenge, index) => (
              <Card 
                key={challenge.id} 
                className={cn(
                  "p-5 border-2 overflow-hidden relative animate-fade-in",
                  challenge.progress >= challenge.target 
                    ? "border-success bg-success-light" 
                    : "border-primary/20"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  {/* Emoji */}
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center text-3xl bg-gradient-to-br shadow-lg",
                    challenge.color
                  )}>
                    {challenge.emoji}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-foreground text-lg">{challenge.title}</h3>
                      <span className="flex items-center gap-1 text-sm bg-accent/10 text-accent px-2 py-1 rounded-full font-medium">
                        <Flame className="w-4 h-4" />
                        {challenge.daysLeft}d
                      </span>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-bold text-foreground">
                          {typeof challenge.progress === 'number' && challenge.progress % 1 !== 0 
                            ? `£${challenge.progress.toFixed(2)}` 
                            : challenge.progress} / {challenge.target}
                        </span>
                      </div>
                      <div className="h-4 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all duration-700 bg-gradient-to-r",
                            challenge.color
                          )}
                          style={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Badges Collection */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-badge-gold" />
              <h2 className="text-xl font-bold text-foreground">My Badges</h2>
            </div>
            <span className="text-sm text-muted-foreground">{kidData.totalBadges}/5 earned</span>
          </div>
          
          <Card className="p-6">
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
              {badges.map((badge, index) => (
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
