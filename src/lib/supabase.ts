import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Product = {
  id: string;
  model_number: number;
  title: string;
  price: number;
  image_url: string;
  created_at: string;
};

export type CartItem = {
  id: string;
  user_session_id: string;
  product_id: string;
  quantity: number;
  message: string | null;
  created_at: string;
  updated_at: string;
};
