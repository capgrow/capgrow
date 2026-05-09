-- =====================================================
-- EMERGENCY FIX - Yeh script Supabase SQL Editor mein run karein
-- Yeh sab tables ki RLS hatati hai taake sab kuch kaam kare
-- =====================================================

-- 1. LUCKY_DRAWS - RLS disable
ALTER TABLE public.lucky_draws DISABLE ROW LEVEL SECURITY;
GRANT ALL ON public.lucky_draws TO anon, authenticated;

-- 2. WINNERS - RLS disable
ALTER TABLE public.winners DISABLE ROW LEVEL SECURITY;
GRANT ALL ON public.winners TO anon, authenticated;

-- 3. TRANSACTIONS - RLS disable
ALTER TABLE public.transactions DISABLE ROW LEVEL SECURITY;
GRANT ALL ON public.transactions TO anon, authenticated;

-- 4. USERS - RLS disable
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
GRANT ALL ON public.users TO anon, authenticated;

-- 5. TICKETS - RLS disable
ALTER TABLE public.tickets DISABLE ROW LEVEL SECURITY;
GRANT ALL ON public.tickets TO anon, authenticated;

-- Refresh schema
NOTIFY pgrst, 'reload schema';
