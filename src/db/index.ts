import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public',
  },
});

export type Artwork = {
  id: number;
  title: string;
  artist_name: string;
  artist_avatar: string;
  artist_profile_url: string | null;
  image: string;
  image_url: string;
  likes: number;
  comments: number;
  date_added: string;
  curator_address: string;
  curator_name: string | null;
  curator_avatar: string | null;
  score: number;
};