
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_plan text NOT NULL DEFAULT 'free';
ALTER TABLE public.user_listings ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false;
ALTER TABLE public.user_listings ADD COLUMN IF NOT EXISTS homepage_featured boolean NOT NULL DEFAULT false;
ALTER TABLE public.user_listings ADD COLUMN IF NOT EXISTS expires_at timestamptz;
ALTER TABLE public.user_listings ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active';
