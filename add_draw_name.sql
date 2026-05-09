ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS draw_name TEXT;
NOTIFY pgrst, 'reload schema';
