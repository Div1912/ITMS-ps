-- Add video_url column to store Vercel Blob URLs for playback
ALTER TABLE public.video_recordings
ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Update RLS policy to allow public delete
DROP POLICY IF EXISTS video_recordings_delete_public ON public.video_recordings;
CREATE POLICY video_recordings_delete_public ON public.video_recordings
  FOR DELETE USING (true);

-- Add comment for clarity
COMMENT ON COLUMN public.video_recordings.video_url IS 'Vercel Blob storage URL for video playback and download';
