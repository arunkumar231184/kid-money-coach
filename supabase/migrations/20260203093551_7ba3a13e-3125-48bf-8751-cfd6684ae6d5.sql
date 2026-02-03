-- Create table for PIN reset requests
CREATE TABLE public.pin_reset_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kid_id UUID NOT NULL REFERENCES public.kids(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'dismissed')),
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pin_reset_requests ENABLE ROW LEVEL SECURITY;

-- Parents can view their kids' reset requests
CREATE POLICY "Parents can view their kids reset requests"
ON public.pin_reset_requests
FOR SELECT
USING (public.user_owns_kid(kid_id));

-- Parents can update (resolve) their kids' reset requests
CREATE POLICY "Parents can update their kids reset requests"
ON public.pin_reset_requests
FOR UPDATE
USING (public.user_owns_kid(kid_id));

-- Parents can delete their kids' reset requests
CREATE POLICY "Parents can delete their kids reset requests"
ON public.pin_reset_requests
FOR DELETE
USING (public.user_owns_kid(kid_id));

-- Anyone can create a reset request (kids don't have auth)
CREATE POLICY "Anyone can create reset requests"
ON public.pin_reset_requests
FOR INSERT
WITH CHECK (true);

-- Add index for efficient lookups
CREATE INDEX idx_pin_reset_requests_kid_id ON public.pin_reset_requests(kid_id);
CREATE INDEX idx_pin_reset_requests_status ON public.pin_reset_requests(status);