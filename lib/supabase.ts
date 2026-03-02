import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Matter {
  id: string;
  matter_number: string;
  client_number: string;
  case_name: string;
  court: string;
  judge: string;
  practice_area: string;
  status: 'Active' | 'Pending' | 'Closed' | 'On Hold';
  filing_date: string;
  created_at: string;
  updated_at: string;
}

export interface Deadline {
  id: string;
  matter_id: string;
  title: string;
  deadline_date: string;
  description: string;
  is_completed: boolean;
  created_at: string;
}

export interface DashboardItem {
  id: string;
  matter_number: string;
  case_name: string;
  court: string;
  practice_area: string;
  status: string;
  deadline_title: string;
  deadline_date: string;
  is_completed: boolean;
  days_until_deadline: number;
}
