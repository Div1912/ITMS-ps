-- Create table for video recording metadata with timestamps
CREATE TABLE IF NOT EXISTS public.video_recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  duration INTEGER NOT NULL,
  file_size BIGINT NOT NULL,
  resolution TEXT NOT NULL,
  format TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.video_recordings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY video_recordings_select_public ON public.video_recordings
  FOR SELECT USING (true);

-- Allow public insert
CREATE POLICY video_recordings_insert_public ON public.video_recordings
  FOR INSERT WITH CHECK (true);
