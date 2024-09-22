import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';
import { config } from '@/config';

export function createClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    config.env.supabase.url,
    config.env.supabase.key,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (e) {
            throw new Error(`Failed to set cookies: ${e}`);
          }
        },
      },
    },
  );
}

export function createAdminClient() {
  return createSupabaseClient<Database>(
    config.env.supabase.url,
    config.env.supabase.serviceRole,
  );
}
