-- Law Firm Docketing App - Database Schema
-- Run this in Supabase SQL Editor

-- Create matters table
CREATE TABLE IF NOT EXISTS matters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  matter_number TEXT UNIQUE NOT NULL,
  client_number TEXT,
  case_name TEXT NOT NULL,
  court TEXT,
  judge TEXT,
  practice_area TEXT,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Pending', 'Closed', 'On Hold')),
  filing_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create deadlines table
CREATE TABLE IF NOT EXISTS deadlines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  matter_id UUID REFERENCES matters(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  deadline_date DATE NOT NULL,
  description TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE matters ENABLE ROW LEVEL SECURITY;
ALTER TABLE deadlines ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (prototype - for production, add auth)
CREATE POLICY "Enable all access for matters" ON matters FOR ALL USING (true);
CREATE POLICY "Enable all access for deadlines" ON deadlines FOR ALL USING (true);

-- Insert some sample data
INSERT INTO matters (matter_number, client_number, case_name, court, judge, practice_area, status, filing_date)
VALUES 
  ('2026-001', 'CLT-001', 'Smith v. Jones', 'Superior Court', 'Hon. Johnson', 'Family Law', 'Active', '2026-01-15'),
  ('2026-002', 'CLT-002', 'State v. Martinez', 'District Court', 'Hon. Williams', 'Criminal Defense', 'Active', '2026-02-01'),
  ('2026-003', 'CLT-003', 'Acme Corp Contract Dispute', 'Superior Court', 'Hon. Brown', 'Corporate', 'Pending', '2026-01-20');

-- Insert sample deadlines with automation logic (30 days from filing)
INSERT INTO deadlines (matter_id, title, deadline_date, description)
SELECT 
  id,
  'Response Due - 30 Days',
  filing_date + INTERVAL '30 days',
  'Automated: 30-day response deadline from filing'
FROM matters 
WHERE filing_date IS NOT NULL;

-- Function to add automated deadlines for new matters
CREATE OR REPLACE FUNCTION handle_new_matter()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.filing_date IS NOT NULL THEN
    INSERT INTO deadlines (matter_id, title, deadline_date, description)
    VALUES (
      NEW.id,
      'Response Due - 30 Days',
      NEW.filing_date + INTERVAL '30 days',
      'Automated: 30-day response deadline from filing'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-create deadlines when matter is inserted
DROP TRIGGER IF EXISTS auto_deadline_on_matter ON matters;
CREATE TRIGGER auto_deadline_on_matter
AFTER INSERT ON matters
FOR EACH ROW
EXECUTE FUNCTION handle_new_matter();

-- View for dashboard
CREATE OR REPLACE VIEW dashboard AS
SELECT 
  m.id,
  m.matter_number,
  m.case_name,
  m.court,
  m.practice_area,
  m.status,
  d.title as deadline_title,
  d.deadline_date,
  d.is_completed,
  d.deadline_date - CURRENT_DATE as days_until_deadline
FROM matters m
LEFT JOIN deadlines d ON m.id = d.matter_id AND d.is_completed = FALSE
ORDER BY d.deadline_date ASC NULLS LAST;
