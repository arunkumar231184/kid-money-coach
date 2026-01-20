-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Kids can manage their own subscriptions" ON public.push_subscriptions;
DROP POLICY IF EXISTS "Service can insert notification logs" ON public.notification_logs;

-- Create a more secure policy for push_subscriptions
-- Since kids login via PIN (not auth), we need to allow anonymous inserts but with kid_id validation
-- The edge function will use service role key to insert, so we just need parent access for management
CREATE POLICY "Service role can manage subscriptions"
ON public.push_subscriptions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create a more secure policy for notification_logs
CREATE POLICY "Service role can insert notification logs"
ON public.notification_logs
FOR INSERT
TO service_role
WITH CHECK (true);