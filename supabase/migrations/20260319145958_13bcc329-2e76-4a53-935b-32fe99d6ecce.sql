
CREATE TABLE public.itineraries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  destination text NOT NULL,
  departure_city text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  num_days integer NOT NULL,
  trip_type text NOT NULL DEFAULT 'couple',
  travelers_adults integer NOT NULL DEFAULT 2,
  travelers_children integer NOT NULL DEFAULT 0,
  children_ages integer[] DEFAULT '{}',
  interests text[] DEFAULT '{}',
  budget_level text NOT NULL DEFAULT 'mid-range',
  language text NOT NULL DEFAULT 'en',
  extras text[] DEFAULT '{}',
  content_markdown text,
  pdf_url text,
  stripe_payment_id text,
  price_paid numeric DEFAULT 15,
  public_share_token text UNIQUE,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own itineraries" ON public.itineraries
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own itineraries" ON public.itineraries
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage itineraries" ON public.itineraries
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Public can view shared itineraries" ON public.itineraries
  FOR SELECT TO anon
  USING (public_share_token IS NOT NULL);

CREATE POLICY "Admins can view all itineraries" ON public.itineraries
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_itineraries_updated_at
  BEFORE UPDATE ON public.itineraries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
