-- Create spending limits table
CREATE TABLE public.spending_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kid_id UUID NOT NULL REFERENCES public.kids(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  limit_amount DECIMAL(10,2) NOT NULL,
  period TEXT NOT NULL DEFAULT 'weekly' CHECK (period IN ('daily', 'weekly', 'monthly')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(kid_id, category, period)
);

-- Enable RLS
ALTER TABLE public.spending_limits ENABLE ROW LEVEL SECURITY;

-- RLS policies for spending limits
CREATE POLICY "Parents can view their kids spending limits"
ON public.spending_limits FOR SELECT
USING (user_owns_kid(kid_id));

CREATE POLICY "Parents can create spending limits for their kids"
ON public.spending_limits FOR INSERT
WITH CHECK (user_owns_kid(kid_id));

CREATE POLICY "Parents can update their kids spending limits"
ON public.spending_limits FOR UPDATE
USING (user_owns_kid(kid_id));

CREATE POLICY "Parents can delete their kids spending limits"
ON public.spending_limits FOR DELETE
USING (user_owns_kid(kid_id));

-- Add updated_at trigger
CREATE TRIGGER update_spending_limits_updated_at
BEFORE UPDATE ON public.spending_limits
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();