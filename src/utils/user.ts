import { createClient } from '@/lib/supabase/server';

export async function getUserProfile() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw error;
  }

  const user = data.user;

  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .limit(1)
    .single();

  if (profileError) {
    throw profileError;
  }

  return {
    user,
    profile: profileData,
  };
}
