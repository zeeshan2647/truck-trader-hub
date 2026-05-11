
CREATE TABLE public.user_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  category text NOT NULL DEFAULT 'truck',
  brand text,
  model text,
  year integer,
  price integer,
  mileage integer,
  location text,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_listings_select_all"
  ON public.user_listings FOR SELECT
  USING (true);

CREATE POLICY "user_listings_insert_own"
  ON public.user_listings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_listings_update_own"
  ON public.user_listings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "user_listings_delete_own"
  ON public.user_listings FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER user_listings_touch_updated_at
  BEFORE UPDATE ON public.user_listings
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE INDEX user_listings_user_id_idx ON public.user_listings(user_id);
