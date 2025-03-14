-- Create prediction_history table if it doesn't exist
CREATE TABLE IF NOT EXISTS prediction_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  match_id VARCHAR NOT NULL,
  match_name VARCHAR NOT NULL,
  prediction TEXT NOT NULL,
  result VARCHAR,
  sport VARCHAR NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE prediction_history ENABLE ROW LEVEL SECURITY;

-- Create policy for users to see only their own predictions
DROP POLICY IF EXISTS "Users can view their own predictions";
CREATE POLICY "Users can view their own predictions"
  ON prediction_history
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy for users to insert their own predictions
DROP POLICY IF EXISTS "Users can insert their own predictions";
CREATE POLICY "Users can insert their own predictions"
  ON prediction_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own predictions
DROP POLICY IF EXISTS "Users can update their own predictions";
CREATE POLICY "Users can update their own predictions"
  ON prediction_history
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Add to realtime publication
alter publication supabase_realtime add table prediction_history;
