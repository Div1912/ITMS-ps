-- Create table for storing track infringement detections
CREATE TABLE IF NOT EXISTS public.infringement_detections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  infringement_id TEXT NOT NULL,
  type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'warning', 'info')),
  location TEXT NOT NULL,
  camera TEXT NOT NULL,
  confidence NUMERIC NOT NULL,
  description TEXT NOT NULL,
  action TEXT NOT NULL,
  object_type TEXT NOT NULL,
  image_url TEXT,
  detection_box JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.infringement_detections ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (read/write)
CREATE POLICY "infringement_select_public" ON public.infringement_detections
  FOR SELECT USING (true);

CREATE POLICY "infringement_insert_public" ON public.infringement_detections
  FOR INSERT WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_infringement_created_at ON public.infringement_detections(created_at DESC);
CREATE INDEX idx_infringement_severity ON public.infringement_detections(severity);
