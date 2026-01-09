import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TransactionList } from "@/components/TransactionList";
import { ChallengeCard } from "@/components/ChallengeCard";
import { SavingsThermometer } from "@/components/SavingsThermometer";
import { InsightCard } from "@/components/InsightCard";
import { AchievementBadge } from "@/components/AchievementBadge";
import { 
  User, 
  PiggyBank, 
  Bell, 
  Settings, 
  ChevronRight,
  Wallet,
  Plus,
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";

// Mock data
const mockTransactions = [
  { id: "1", merchant: "Steam", amount: 4.99, category: "gaming" as const, date: "Today, 2:30 PM" },
  { id: "2", merchant: "Costa Coffee", amount: 3.20, category: "snacks" as const, date: "Today, 11:15 AM" },
  { id: "3", merchant: "Boots", amount: 8.50, category: "fashion" as const, date: "Yesterday" },
  { id: "4", merchant: "TfL", amount: 2.40, category: "transport" as const, date: "Yesterday" },
  { id: "5", merchant: "Allowance", amount: 20.00, category: "savings" as const, date: "Monday", isCredit: true },
];

export function ParentDashboard() {
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
              <p className="font-semibold text-foreground">Sarah's Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Child summary card */}
        <Link to="/kid">
          <Card className="p-5 hero-gradient text-primary-foreground cursor-pointer hover:shadow-glow transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-2xl">
                  👦
                </div>
                <div>
                  <h2 className="text-xl font-bold">Alex (14)</h2>
                  <p className="text-primary-foreground/80 text-sm">Santander 123 Mini</p>
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
                  Weekly Allowance
                </div>
                <p className="text-2xl font-bold mt-1">£20.00</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-3">
                <div className="flex items-center gap-2 text-primary-foreground/80 text-sm">
                  <PiggyBank className="w-4 h-4" />
                  Savings
                </div>
                <p className="text-2xl font-bold mt-1">£12.50</p>
              </div>
            </div>
          </Card>
        </Link>
        
        {/* Weekly insight */}
        <InsightCard 
          title="Weekly Insight"
          message="Snacks spending is up 25% compared to last week. Costa visits account for most of this - maybe a chat about bringing a flask to school?"
          trend="up"
          category="Snacks +25%"
          actionLabel="Start a conversation"
        />
        
        {/* Active challenges */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Active Challenges</h3>
            <Button variant="ghost" size="sm" className="text-primary">
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
          <div className="space-y-3">
            <ChallengeCard 
              type="save-allowance"
              title="Save £5 This Week"
              description="Put aside £5 from your allowance"
              progress={3}
              target={7}
              status="active"
              daysLeft={4}
            />
            <ChallengeCard 
              type="snack-tracker"
              title="Snack Budget £10"
              description="Keep snacks under £10 this week"
              progress={6.70}
              target={10}
              status="active"
              daysLeft={4}
            />
          </div>
        </section>
        
        {/* Savings goal */}
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-4">Savings Goal</h3>
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">👟</span>
              <div>
                <h4 className="font-semibold">New Trainers</h4>
                <p className="text-sm text-muted-foreground">Nike Air Max</p>
              </div>
            </div>
            <SavingsThermometer current={12.50} goal={85} label="" />
          </Card>
        </section>
        
        {/* Badges earned */}
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-4">Alex's Badges</h3>
          <div className="flex gap-4 overflow-x-auto pb-2">
            <AchievementBadge type="first-week" earned />
            <AchievementBadge type="streak" earned count={3} />
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
          <TransactionList transactions={mockTransactions} />
        </section>
      </main>
    </div>
  );
}
