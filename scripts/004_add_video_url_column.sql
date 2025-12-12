-- Add video_url column to store Vercel Blob URLs
ALTER TABLE public.video_recordings
ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Allow public delete
CREATE POLICY IF NOT EXISTS video_recordings_delete_public ON public.video_recordings
  FOR DELETE USING (true);
