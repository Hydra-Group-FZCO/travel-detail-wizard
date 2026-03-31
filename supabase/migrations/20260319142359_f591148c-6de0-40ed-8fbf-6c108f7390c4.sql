
-- eSIM packages cache table
CREATE TABLE IF NOT EXISTS public.esim_packages_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_code text UNIQUE NOT NULL,
  name text NOT NULL,
  slug text,
  price_wholesale numeric NOT NULL DEFAULT 0,
  price_retail_eur numeric NOT NULL DEFAULT 0,
  data_gb numeric,
  duration_days integer,
  countries text[] DEFAULT '{}',
  location_code text,
  operator text,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.esim_packages_cache ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view esim packages" ON public.esim_packages_cache;
DROP POLICY IF EXISTS "Admins can manage esim packages" ON public.esim_packages_cache;
DROP POLICY IF EXISTS "Service role can manage esim packages cache" ON public.esim_packages_cache;

CREATE POLICY "Anyone can view esim packages" ON public.esim_packages_cache
  FOR SELECT TO public USING (true);

CREATE POLICY "Admins can manage esim packages" ON public.esim_packages_cache
  FOR ALL TO public USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role can manage esim packages cache" ON public.esim_packages_cache
  FOR ALL TO public USING (auth.role() = 'service_role'::text)
  WITH CHECK (auth.role() = 'service_role'::text);

-- eSIM orders table
CREATE TABLE IF NOT EXISTS public.esim_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  package_code text NOT NULL,
  order_no text,
  iccid text,
  qr_code_url text,
  activation_code text,
  status text NOT NULL DEFAULT 'pending',
  stripe_payment_id text,
  price_paid_eur numeric NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.esim_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own esim orders" ON public.esim_orders;
DROP POLICY IF EXISTS "Service role can manage esim orders" ON public.esim_orders;
DROP POLICY IF EXISTS "Admins can view all esim orders" ON public.esim_orders;
DROP POLICY IF EXISTS "Admins can update esim orders" ON public.esim_orders;
DROP POLICY IF EXISTS "Users can insert own esim orders" ON public.esim_orders;

CREATE POLICY "Users can view own esim orders" ON public.esim_orders
  FOR SELECT TO public USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage esim orders" ON public.esim_orders
  FOR ALL TO public USING (auth.role() = 'service_role'::text)
  WITH CHECK (auth.role() = 'service_role'::text);

CREATE POLICY "Admins can view all esim orders" ON public.esim_orders
  FOR SELECT TO public USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update esim orders" ON public.esim_orders
  FOR UPDATE TO public USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can insert own esim orders" ON public.esim_orders
  FOR INSERT TO public WITH CHECK (auth.uid() = user_id);

DROP TRIGGER IF EXISTS update_esim_orders_updated_at ON public.esim_orders;
CREATE TRIGGER update_esim_orders_updated_at
  BEFORE UPDATE ON public.esim_orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
