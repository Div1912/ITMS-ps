-- Create table for acceleration/vibration monitoring data
CREATE TABLE IF NOT EXISTS acceleration_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vertical_accel NUMERIC NOT NULL,
  lateral_accel NUMERIC NOT NULL,
  longitudinal_accel NUMERIC NOT NULL,
  rms_vibration NUMERIC,
  peak_vibration NUMERIC,
  ride_quality_index NUMERIC,
  frequency_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE acceleration_data ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY acceleration_select_public ON acceleration_data
  FOR SELECT
  USING (true);

-- Create policy to allow public insert
CREATE POLICY acceleration_insert_public ON acceleration_data
  FOR INSERT
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_acceleration_created_at ON acceleration_data(created_at DESC);
