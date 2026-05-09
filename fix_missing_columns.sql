-- Add missing columns to winners table
ALTER TABLE public.winners ADD COLUMN IF NOT EXISTS winner_cnic TEXT;

-- Add description column if missing (though it usually exists in lucky_draws)
ALTER TABLE public.lucky_draws ADD COLUMN IF NOT EXISTS description TEXT;

-- Refresh schema
NOTIFY pgrst, 'reload schema';
