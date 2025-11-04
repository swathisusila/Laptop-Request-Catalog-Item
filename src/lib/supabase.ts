import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface LaptopModel {
  id: string;
  name: string;
  brand: string;
  processor: string;
  ram: string;
  storage: string;
  screen_size: string;
  image_url: string;
  price: number;
  available: boolean;
  created_at: string;
}

export interface LaptopRequest {
  id: string;
  laptop_model_id: string;
  requester_name: string;
  requester_email: string;
  business_justification: string;
  status: string;
  created_at: string;
  updated_at: string;
}
