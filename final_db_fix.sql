-- =====================================================
-- FINAL EMERGENCY DATABASE FIX
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Ensure columns exist in winners
ALTER TABLE public.winners ADD COLUMN IF NOT EXISTS winner_cnic TEXT;

-- 2. Ensure columns exist in transactions
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS screenshot TEXT;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS draw_name TEXT;

-- 3. Ensure columns exist in lucky_draws
ALTER TABLE public.lucky_draws ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.lucky_draws ADD COLUMN IF NOT EXISTS image TEXT;

-- 4. Disable RLS for all tables to allow frontend control (Development Mode)
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.lucky_draws DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.winners DISABLE ROW LEVEL SECURITY;

-- 5. Grant Permissions
GRANT ALL ON public.users TO anon, authenticated;
GRANT ALL ON public.lucky_draws TO anon, authenticated;
GRANT ALL ON public.tickets TO anon, authenticated;
GRANT ALL ON public.transactions TO anon, authenticated;
GRANT ALL ON public.winners TO anon, authenticated;

-- 6. Refresh PostgREST schema
NOTIFY pgrst, 'reload schema';
