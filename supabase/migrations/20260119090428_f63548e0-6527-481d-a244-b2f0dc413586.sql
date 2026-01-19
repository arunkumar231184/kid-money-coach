-- Add PIN column to kids table (stored as hash for security)
ALTER TABLE public.kids ADD COLUMN pin_hash TEXT;

-- Create a function to verify kid PIN (returns kid_id if valid, null otherwise)
CREATE OR REPLACE FUNCTION public.verify_kid_pin(p_kid_id UUID, p_pin TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_stored_hash TEXT;
BEGIN
  SELECT pin_hash INTO v_stored_hash
  FROM public.kids
  WHERE id = p_kid_id;
  
  IF v_stored_hash IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Simple hash comparison (PIN is hashed with kid_id as salt)
  IF v_stored_hash = encode(sha256((p_kid_id::text || p_pin)::bytea), 'hex') THEN
    RETURN p_kid_id;
  END IF;
  
  RETURN NULL;
END;
$$;

-- Create a function to set kid PIN (only callable by parent)
CREATE OR REPLACE FUNCTION public.set_kid_pin(p_kid_id UUID, p_pin TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify the caller is the parent of this kid
  IF NOT EXISTS (
    SELECT 1 FROM public.kids 
    WHERE id = p_kid_id AND parent_id = auth.uid()
  ) THEN
    RETURN FALSE;
  END IF;
  
  -- Update the PIN hash
  UPDATE public.kids
  SET pin_hash = encode(sha256((p_kid_id::text || p_pin)::bytea), 'hex')
  WHERE id = p_kid_id;
  
  RETURN TRUE;
END;
$$;

-- Create a policy to allow public read of kid names for PIN login (limited fields)
CREATE POLICY "Anyone can read kid name and avatar for PIN login"
ON public.kids
FOR SELECT
USING (pin_hash IS NOT NULL);