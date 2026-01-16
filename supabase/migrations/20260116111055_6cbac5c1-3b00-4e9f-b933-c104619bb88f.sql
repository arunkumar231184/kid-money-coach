-- Create table to store bank connections
CREATE TABLE public.bank_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kid_id UUID NOT NULL REFERENCES public.kids(id) ON DELETE CASCADE,
  provider TEXT NOT NULL DEFAULT 'truelayer',
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  account_id TEXT,
  account_name TEXT,
  bank_name TEXT,
  connected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_synced_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bank_connections ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Parents can view their kids bank connections"
  ON public.bank_connections
  FOR SELECT
  USING (user_owns_kid(kid_id));

CREATE POLICY "Parents can create bank connections for their kids"
  ON public.bank_connections
  FOR INSERT
  WITH CHECK (user_owns_kid(kid_id));

CREATE POLICY "Parents can update their kids bank connections"
  ON public.bank_connections
  FOR UPDATE
  USING (user_owns_kid(kid_id));

CREATE POLICY "Parents can delete their kids bank connections"
  ON public.bank_connections
  FOR DELETE
  USING (user_owns_kid(kid_id));

-- Add trigger for updated_at
CREATE TRIGGER update_bank_connections_updated_at
  BEFORE UPDATE ON public.bank_connections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add external_id to transactions for deduplication
ALTER TABLE public.transactions 
  ADD COLUMN IF NOT EXISTS external_id TEXT,
  ADD COLUMN IF NOT EXISTS bank_connection_id UUID REFERENCES public.bank_connections(id) ON DELETE SET NULL;

-- Add unique constraint on external_id per kid to prevent duplicate transactions
CREATE UNIQUE INDEX IF NOT EXISTS transactions_external_id_kid_idx 
  ON public.transactions(external_id, kid_id) WHERE external_id IS NOT NULL;