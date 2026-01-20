-- Create table to store push notification subscriptions
CREATE TABLE public.push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kid_id UUID REFERENCES public.kids(id) ON DELETE CASCADE NOT NULL,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(kid_id, endpoint)
);

-- Enable RLS
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy: Parents can manage subscriptions for their kids
CREATE POLICY "Parents can manage kid subscriptions"
ON public.push_subscriptions
FOR ALL
USING (public.user_owns_kid(kid_id))
WITH CHECK (public.user_owns_kid(kid_id));

-- Policy: Allow inserting subscriptions for kid login sessions (no auth required for kids)
CREATE POLICY "Kids can manage their own subscriptions"
ON public.push_subscriptions
FOR ALL
USING (true)
WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_push_subscriptions_updated_at
BEFORE UPDATE ON public.push_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create a notification_logs table to track sent notifications
CREATE TABLE public.notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kid_id UUID REFERENCES public.kids(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL, -- 'spending_alert' or 'new_challenge'
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reference_id UUID -- challenge_id or spending_limit_id
);

-- Enable RLS
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Parents can view notification logs for their kids
CREATE POLICY "Parents can view kid notification logs"
ON public.notification_logs
FOR SELECT
USING (public.user_owns_kid(kid_id));

-- Policy: Allow service to insert logs
CREATE POLICY "Service can insert notification logs"
ON public.notification_logs
FOR INSERT
WITH CHECK (true);