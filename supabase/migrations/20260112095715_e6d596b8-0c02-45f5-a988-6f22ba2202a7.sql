-- Create kids table
CREATE TABLE public.kids (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 1 AND age <= 25),
  avatar_url TEXT,
  allowance_amount DECIMAL(10,2) DEFAULT 0,
  allowance_frequency TEXT DEFAULT 'weekly' CHECK (allowance_frequency IN ('weekly', 'monthly')),
  bank_account_connected BOOLEAN DEFAULT false,
  total_saved DECIMAL(10,2) DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  total_badges INTEGER DEFAULT 0,
  xp_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kid_id UUID NOT NULL REFERENCES public.kids(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  merchant TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('snacks', 'gaming', 'fashion', 'transport', 'savings', 'entertainment', 'other')),
  description TEXT,
  transaction_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_income BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create challenges table
CREATE TABLE public.challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kid_id UUID NOT NULL REFERENCES public.kids(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('snack_tracker', 'save_percentage', 'no_impulse', 'round_ups', 'savings_goal')),
  target_value DECIMAL(10,2) NOT NULL,
  current_value DECIMAL(10,2) DEFAULT 0,
  target_days INTEGER,
  current_days INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'failed', 'paused')),
  reward_xp INTEGER DEFAULT 50,
  reward_badge TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create savings_goals table
CREATE TABLE public.savings_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kid_id UUID NOT NULL REFERENCES public.kids(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  target_amount DECIMAL(10,2) NOT NULL,
  current_amount DECIMAL(10,2) DEFAULT 0,
  icon TEXT DEFAULT '🎯',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create badges table (earned achievements)
CREATE TABLE public.badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kid_id UUID NOT NULL REFERENCES public.kids(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL,
  rarity TEXT NOT NULL DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create weekly_insights table
CREATE TABLE public.weekly_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kid_id UUID NOT NULL REFERENCES public.kids(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  insight_type TEXT NOT NULL CHECK (insight_type IN ('spending', 'saving', 'achievement', 'tip')),
  week_ending DATE NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.kids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_insights ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user owns a kid
CREATE OR REPLACE FUNCTION public.user_owns_kid(kid_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.kids
    WHERE id = kid_id AND parent_id = auth.uid()
  )
$$;

-- RLS Policies for kids table
CREATE POLICY "Parents can view their own kids"
ON public.kids FOR SELECT
USING (parent_id = auth.uid());

CREATE POLICY "Parents can create kids"
ON public.kids FOR INSERT
WITH CHECK (parent_id = auth.uid());

CREATE POLICY "Parents can update their own kids"
ON public.kids FOR UPDATE
USING (parent_id = auth.uid());

CREATE POLICY "Parents can delete their own kids"
ON public.kids FOR DELETE
USING (parent_id = auth.uid());

-- RLS Policies for transactions table
CREATE POLICY "Parents can view their kids transactions"
ON public.transactions FOR SELECT
USING (public.user_owns_kid(kid_id));

CREATE POLICY "Parents can create transactions for their kids"
ON public.transactions FOR INSERT
WITH CHECK (public.user_owns_kid(kid_id));

CREATE POLICY "Parents can update their kids transactions"
ON public.transactions FOR UPDATE
USING (public.user_owns_kid(kid_id));

CREATE POLICY "Parents can delete their kids transactions"
ON public.transactions FOR DELETE
USING (public.user_owns_kid(kid_id));

-- RLS Policies for challenges table
CREATE POLICY "Parents can view their kids challenges"
ON public.challenges FOR SELECT
USING (public.user_owns_kid(kid_id));

CREATE POLICY "Parents can create challenges for their kids"
ON public.challenges FOR INSERT
WITH CHECK (public.user_owns_kid(kid_id));

CREATE POLICY "Parents can update their kids challenges"
ON public.challenges FOR UPDATE
USING (public.user_owns_kid(kid_id));

CREATE POLICY "Parents can delete their kids challenges"
ON public.challenges FOR DELETE
USING (public.user_owns_kid(kid_id));

-- RLS Policies for savings_goals table
CREATE POLICY "Parents can view their kids savings goals"
ON public.savings_goals FOR SELECT
USING (public.user_owns_kid(kid_id));

CREATE POLICY "Parents can create savings goals for their kids"
ON public.savings_goals FOR INSERT
WITH CHECK (public.user_owns_kid(kid_id));

CREATE POLICY "Parents can update their kids savings goals"
ON public.savings_goals FOR UPDATE
USING (public.user_owns_kid(kid_id));

CREATE POLICY "Parents can delete their kids savings goals"
ON public.savings_goals FOR DELETE
USING (public.user_owns_kid(kid_id));

-- RLS Policies for badges table
CREATE POLICY "Parents can view their kids badges"
ON public.badges FOR SELECT
USING (public.user_owns_kid(kid_id));

CREATE POLICY "Parents can create badges for their kids"
ON public.badges FOR INSERT
WITH CHECK (public.user_owns_kid(kid_id));

-- RLS Policies for weekly_insights table
CREATE POLICY "Parents can view their kids insights"
ON public.weekly_insights FOR SELECT
USING (public.user_owns_kid(kid_id));

CREATE POLICY "Parents can update their kids insights"
ON public.weekly_insights FOR UPDATE
USING (public.user_owns_kid(kid_id));

-- Create indexes for better performance
CREATE INDEX idx_kids_parent_id ON public.kids(parent_id);
CREATE INDEX idx_transactions_kid_id ON public.transactions(kid_id);
CREATE INDEX idx_transactions_date ON public.transactions(transaction_date);
CREATE INDEX idx_transactions_category ON public.transactions(category);
CREATE INDEX idx_challenges_kid_id ON public.challenges(kid_id);
CREATE INDEX idx_challenges_status ON public.challenges(status);
CREATE INDEX idx_savings_goals_kid_id ON public.savings_goals(kid_id);
CREATE INDEX idx_badges_kid_id ON public.badges(kid_id);
CREATE INDEX idx_weekly_insights_kid_id ON public.weekly_insights(kid_id);

-- Triggers for updated_at
CREATE TRIGGER update_kids_updated_at
BEFORE UPDATE ON public.kids
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_challenges_updated_at
BEFORE UPDATE ON public.challenges
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_savings_goals_updated_at
BEFORE UPDATE ON public.savings_goals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();