-- Fix permissions for items table to allow proper authentication
-- This migration adds RLS policies to allow users to access their own items

-- Grant basic permissions to anon role (for unauthenticated access)
GRANT SELECT ON items TO anon;
GRANT INSERT ON items TO anon;

-- Grant full permissions to authenticated role
GRANT ALL PRIVILEGES ON items TO authenticated;

-- Create RLS policy to allow users to see their own items
CREATE POLICY "Users can view own items" ON items
  FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Create RLS policy to allow users to insert their own items
CREATE POLICY "Users can insert own items" ON items
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Create RLS policy to allow users to update their own items
CREATE POLICY "Users can update own items" ON items
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create RLS policy to allow users to delete their own items
CREATE POLICY "Users can delete own items" ON items
  FOR DELETE
  USING (auth.uid() = user_id);