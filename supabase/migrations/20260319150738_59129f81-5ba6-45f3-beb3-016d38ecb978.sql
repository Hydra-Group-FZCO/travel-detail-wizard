
CREATE TABLE IF NOT EXISTS public.travel_guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  destination text NOT NULL,
  destination_slug text NOT NULL,
  focus_areas text[] DEFAULT '{}',
  depth text NOT NULL DEFAULT 'essential',
  language text NOT NULL DEFAULT 'en',
  season text DEFAULT 'unknown',
  content_markdown text,
  pdf_url text,
  stripe_payment_id text,
  price_paid numeric DEFAULT 9,
  public_share_token text UNIQUE,
  word_count integer DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.travel_guides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own guides" ON public.travel_guides;
DROP POLICY IF EXISTS "Users can insert own guides" ON public.travel_guides;
DROP POLICY IF EXISTS "Service role can manage guides" ON public.travel_guides;
DROP POLICY IF EXISTS "Public can view shared guides" ON public.travel_guides;
DROP POLICY IF EXISTS "Admins can view all guides" ON public.travel_guides;

CREATE POLICY "Users can view own guides" ON public.travel_guides
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own guides" ON public.travel_guides
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage guides" ON public.travel_guides
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Public can view shared guides" ON public.travel_guides
  FOR SELECT TO anon
  USING (public_share_token IS NOT NULL);

CREATE POLICY "Admins can view all guides" ON public.travel_guides
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS update_travel_guides_updated_at ON public.travel_guides;
CREATE TRIGGER update_travel_guides_updated_at
  BEFORE UPDATE ON public.travel_guides
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
