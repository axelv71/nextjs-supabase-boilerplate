import { createClient as createClientServer } from '@/lib/supabase/server';

export async function getRequiredUser() {
  const supabase = createClientServer();

  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw error;
  }

  return data.user;
}
