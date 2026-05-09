ALTER TABLE public.lucky_draws ADD COLUMN IF NOT EXISTS winner_cnic TEXT;
NOTIFY pgrst, 'reload schema';
