ALTER TABLE public.travel_guides
  ADD COLUMN IF NOT EXISTS token_budget integer;

COMMENT ON COLUMN public.travel_guides.token_budget IS 'AI output token budget selected at purchase; maps to price 9–500 USD.';
