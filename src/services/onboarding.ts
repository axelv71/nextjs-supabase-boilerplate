import { SupabaseClient } from '@supabase/supabase-js';

export async function getOnboardingIfCompleted(
  supabase: SupabaseClient,
): Promise<boolean> {
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (!user || userError) {
    throw new Error('User not found');
  }

  const { data, error } = await supabase
    .from('onboarding')
    .select('values')
    .eq('id', user.user?.id)
    .single();

  if (error) {
    console.error('Error fetching onboarding:', error);
    return false;
  }

  return !!data;
}
