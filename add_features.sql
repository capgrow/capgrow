ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS screenshot TEXT;

CREATE TABLE IF NOT EXISTS public.winners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  winner_name TEXT NOT NULL,
  prize_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.winners DISABLE ROW LEVEL SECURITY;
NOTIFY pgrst, 'reload schema';
