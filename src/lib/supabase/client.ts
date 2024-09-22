import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database.types';
import { config } from '@/config';

export function createClient() {
  return createBrowserClient<Database>(
    config.env.supabase.url,
    config.env.supabase.key,
  );
}
