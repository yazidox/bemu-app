-- Create chat_history table
CREATE TABLE IF NOT EXISTS chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own chat history" ON chat_history;
CREATE POLICY "Users can view their own chat history"
  ON chat_history FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own chat history" ON chat_history;
CREATE POLICY "Users can insert their own chat history"
  ON chat_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add to realtime
alter publication supabase_realtime add table chat_history;
