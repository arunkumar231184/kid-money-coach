import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Shield, 
  Zap, 
  PiggyBank, 
  Trophy, 
  BarChart3, 
  Smartphone,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Star,
  Gamepad2,
  Target,
  TrendingUp,
  Award,
  Flame,
  Wallet,
  Users,
  Heart
} from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-illustration.png";

const features = [
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description: "Read-only access via Open Banking. We never touch your money, just show transactions."
  },
  {
    icon: Zap,
    title: "Auto-Categorisation",
    description: "Transactions tagged automatically: Gaming, Snacks, Fashion, Transport, and more."
  },
  {
    icon: Trophy,
    title: "Gamified Challenges",
    description: "Fun savings challenges with badges and streaks that make learning money skills exciting."
  },
  {
    icon: BarChart3,
    title: "Weekly Insights",
    description: "Smart spending insights delivered to your inbox with conversation starters."
  },
  {
    icon: PiggyBank,
    title: "Savings Goals",
    description: "Visual progress towards goals like 'New Trainers' or 'Birthday Fund'."
  },
  {
    icon: Smartphone,
    title: "Mobile First",
    description: "Designed for quick checks on your phone. Dashboard loads in seconds."
  },
];

const kidFeatures = [
  {
    icon: Gamepad2,
    title: "Their Own Fun Dashboard",
    description: "Kids get a colorful, game-like dashboard designed just for them. Easy PIN login means they can check their progress anytime.",
    color: "bg-success-light text-success"
  },
  {
    icon: Target,
    title: "Visual Savings Goals",
    description: "Watch the savings thermometer fill up as they get closer to that new game, trainers, or concert tickets!",
    color: "bg-primary-light text-primary"
  },
  {
    icon: Award,
    title: "Badges & Achievements",
    description: "Earn badges for smart money decisions. From 'First Saver' to 'Challenge Champion' — collect them all!",
    color: "bg-badge-gold/20 text-badge-gold"
  },
  {
    icon: Flame,
    title: "Streaks & XP Points",
    description: "Build saving streaks and level up with XP. The longer they stick to good habits, the more they earn!",
    color: "bg-destructive/10 text-destructive"
  },
];

const learningBenefits = [
  {
    icon: TrendingUp,
    title: "Real Money, Real Lessons",
    description: "Kids learn from their actual spending, not fake scenarios. Every Costa run becomes a teachable moment."
  },
  {
    icon: Wallet,
    title: "Spending Awareness",
    description: "Categorized spending shows exactly where money goes. 'I spent HOW much on snacks?!' is a common revelation."
  },
  {
    icon: Users,
    title: "Family Conversations",
    description: "Weekly insights give parents natural conversation starters about money — no awkward lectures needed."
  },
  {
    icon: Heart,
    title: "Lifelong Habits",
    description: "Research shows financial habits form by age 7. We help reinforce positive behaviors during the crucial teen years."
  },
];

const steps = [
  { step: 1, title: "Sign up free", description: "Create your parent account in 30 seconds" },
  { step: 2, title: "Link bank account", description: "Securely connect your child's youth account" },
  { step: 3, title: "Start learning", description: "Set challenges and watch progress together" },
];

const supportedBanks = ["Santander 123 Mini", "Lloyds Smart Start", "NatWest Adapt", "Nationwide FlexOne"];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-primary-light text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
                <Sparkles className="w-4 h-4" />
                Teaching kids money skills, one transaction at a time
              </div>
              
              <h1 className="text-display-md md:text-display-lg font-bold text-foreground mb-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
                Turn everyday spending into{" "}
                <span className="text-primary">financial lessons</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
                Connect your child's UK youth bank account and watch their money skills grow with gamified challenges, smart insights, and savings goals.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in" style={{ animationDelay: "300ms" }}>
                <Link to="/auth">
                  <Button variant="hero" size="xl">
                    Get Started Free
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="outline" size="xl">
                    See Demo
                  </Button>
                </Link>
              </div>
              
              {/* Social proof */}
              <div className="mt-10 flex items-center gap-4 justify-center lg:justify-start animate-fade-in" style={{ animationDelay: "400ms" }}>
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-sm font-medium">
                      👤
                    </div>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">500+</span> UK families already learning
                  <div className="flex items-center gap-1 text-badge-gold">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right: Image */}
            <div className="relative animate-fade-in" style={{ animationDelay: "200ms" }}>
              <div className="relative z-10">
                <img 
                  src={heroImage} 
                  alt="Parent and teenager learning about finances together" 
                  className="w-full rounded-2xl shadow-card"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-card p-4 rounded-xl shadow-lg border animate-float z-20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-success-light flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">This week</p>
                    <p className="font-bold text-foreground">+3 badges earned!</p>
                  </div>
                </div>
              </div>
              {/* Decorative blob */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Supported banks */}
      <section className="py-12 bg-secondary/50">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground mb-6">Works with leading UK youth bank accounts</p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {supportedBanks.map((bank) => (
              <div key={bank} className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{bank}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section id="features" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-display-sm md:text-display-md font-bold text-foreground mb-4">
              Everything you need to teach money skills
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              No more awkward conversations about spending. Our app gives you the insights and tools to make financial education natural.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                className="p-6 card-hover border animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Kid Dashboard Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-success/5 via-primary/5 to-badge-gold/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-success-light text-success px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Gamepad2 className="w-4 h-4" />
              Made for kids aged 11-17
            </div>
            <h2 className="text-display-sm md:text-display-md font-bold text-foreground mb-4">
              A dashboard kids actually <span className="text-success">want</span> to use
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Forget boring spreadsheets. Our kid-friendly dashboard turns money management into a game with XP, badges, challenges, and visual progress tracking.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {kidFeatures.map((feature, index) => (
              <Card 
                key={feature.title} 
                className="p-6 border-2 hover:shadow-card transition-all animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>

          {/* Kid Dashboard Preview */}
          <Card className="p-6 md:p-8 max-w-4xl mx-auto border-2 border-dashed border-primary/30 bg-card/50">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="p-4 rounded-xl bg-primary-light">
                <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">12</p>
                <p className="text-sm text-muted-foreground">Badges Earned</p>
              </div>
              <div className="p-4 rounded-xl bg-success-light">
                <Flame className="w-8 h-8 text-success mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">7 Days</p>
                <p className="text-sm text-muted-foreground">Saving Streak</p>
              </div>
              <div className="p-4 rounded-xl bg-badge-gold/20">
                <Star className="w-8 h-8 text-badge-gold mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">Level 5</p>
                <p className="text-sm text-muted-foreground">Money Master</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Financial Learning Benefits */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-display-sm md:text-display-md font-bold text-foreground mb-4">
              Financial education that actually <span className="text-primary">works</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Studies show teens who understand money early are more likely to save, avoid debt, and build wealth as adults.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {learningBenefits.map((benefit, index) => (
              <div 
                key={benefit.title} 
                className="flex gap-4 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats callout */}
          <div className="mt-12 p-6 md:p-8 rounded-2xl bg-primary/5 border border-primary/20 max-w-3xl mx-auto">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-3xl md:text-4xl font-bold text-primary">73%</p>
                <p className="text-sm text-muted-foreground mt-1">of teens say they want to learn more about money</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-primary">2x</p>
                <p className="text-sm text-muted-foreground mt-1">more likely to save with visual goals</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-primary">89%</p>
                <p className="text-sm text-muted-foreground mt-1">of parents see improved money habits</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How it works */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-display-sm md:text-display-md font-bold text-foreground mb-4">
              Get started in minutes
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.step} className="text-center animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-glow">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Pricing */}
      <section id="pricing" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-display-sm md:text-display-md font-bold text-foreground mb-4">
              Simple, family-friendly pricing
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free plan */}
            <Card className="p-6 border-2 border-border">
              <h3 className="text-xl font-bold text-foreground mb-2">Free</h3>
              <p className="text-muted-foreground mb-4">Perfect to get started</p>
              <p className="text-4xl font-bold text-foreground mb-6">£0<span className="text-lg font-normal text-muted-foreground">/month</span></p>
              <ul className="space-y-3 mb-6">
                {["1 child account", "Basic challenges", "Weekly email insights", "3 badges to earn"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/auth"><Button variant="outline" className="w-full">Get Started Free</Button></Link>
            </Card>
            
            {/* Premium plan */}
            <Card className="p-6 border-2 border-primary relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg">
                Popular
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Premium</h3>
              <p className="text-muted-foreground mb-4">For the whole family</p>
              <p className="text-4xl font-bold text-foreground mb-6">£2.99<span className="text-lg font-normal text-muted-foreground">/month</span></p>
              <ul className="space-y-3 mb-6">
                {["Unlimited children", "Custom challenges", "Daily insights", "All badges & rewards", "Export reports", "Priority support"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/auth"><Button className="w-full">Start 14-Day Trial</Button></Link>
            </Card>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-display-sm md:text-display-md font-bold text-foreground mb-6">
                Built by parents, for parents
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  We started YouthMentor because we struggled to have meaningful conversations about money with our own kids. 
                  Watching them spend without understanding the value of what they had, we knew there had to be a better way.
                </p>
                <p>
                  Our mission is simple: make financial education natural, fun, and part of everyday life. 
                  No boring lectures, no complicated spreadsheets — just real insights from real spending that spark real conversations.
                </p>
                <p>
                  Based in the UK, we're a small team of parents, educators, and fintech professionals committed to helping 
                  the next generation develop healthy money habits that last a lifetime.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 text-center">
                <p className="text-4xl font-bold text-primary mb-2">500+</p>
                <p className="text-sm text-muted-foreground">UK Families</p>
              </Card>
              <Card className="p-6 text-center">
                <p className="text-4xl font-bold text-primary mb-2">10k+</p>
                <p className="text-sm text-muted-foreground">Transactions Tracked</p>
              </Card>
              <Card className="p-6 text-center">
                <p className="text-4xl font-bold text-primary mb-2">95%</p>
                <p className="text-sm text-muted-foreground">Parent Satisfaction</p>
              </Card>
              <Card className="p-6 text-center">
                <p className="text-4xl font-bold text-primary mb-2">£50k+</p>
                <p className="text-sm text-muted-foreground">Savings Goals Reached</p>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-16 md:py-24 hero-gradient">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-display-sm md:text-display-md font-bold text-primary-foreground mb-4">
            Ready to start teaching money skills?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Join 500+ UK families already using YouthMentor to build better financial habits.
          </p>
          <Link to="/auth">
            <Button variant="glass" size="xl">
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <PiggyBank className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-bold text-foreground">YouthMentor</span>
              </div>
              <p className="text-sm text-muted-foreground">Teaching UK kids money skills, one transaction at a time.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#about" className="hover:text-foreground transition-colors">About Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#about" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="mailto:hello@youthmentor.com" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="mailto:careers@youthmentor.com" className="hover:text-foreground transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                <li><Link to="/cookies" className="hover:text-foreground transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2026 YouthMentor UK. All rights reserved. FCA regulated via Open Banking.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
