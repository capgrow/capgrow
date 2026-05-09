-- Disable RLS to allow direct inserts from the frontend during development/MVP
ALTER TABLE public.lucky_draws DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets DISABLE ROW LEVEL SECURITY;

-- If you prefer keeping RLS enabled but allowing all authenticated users to insert/update, run these instead:
/*
ALTER TABLE public.lucky_draws ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated full access" ON public.lucky_draws FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated full access" ON public.transactions FOR ALL USING (auth.role() = 'authenticated');
*/
