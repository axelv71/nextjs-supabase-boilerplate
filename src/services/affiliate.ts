import 'server-only';
import { Enums } from '@/types/database.types';
import { createAdminClient } from '@/lib/supabase/server';

export async function linkAffiliate(
  refererId: string,
  userId: string,
  type: Enums<'affiliate_type'>,
) {
  const supabase = createAdminClient();
  // Check if the user and referer are not the same
  if (refererId === userId) {
    console.error('User and referer are the same');
    return;
  }

  // Check if the code exists
  const { data: referral, error: referralError } = await supabase
    .from('promotional_codes')
    .select('*')
    .eq('referer_id', refererId)
    .single();

  if (referralError || !referral) {
    console.error('Error fetching referral:', referralError);
    return;
  }

  // Check if the user is already linked to a referer
  const { data: exisitingAffiliation, error: affiliationError } = await supabase
    .from('affiliate')
    .select('*')
    .eq('user_id', userId);

  if (affiliationError) {
    console.error('Error fetching affiliation:', affiliationError);
    return;
  }

  if (exisitingAffiliation && exisitingAffiliation.length > 0) {
    console.error('User already has an affiliation');
    return;
  }

  // Create the affiliation
  const { error: insertError } = await supabase.from('affiliate').insert({
    referer_id: referral.referer_id,
    user_id: userId,
    type,
  });

  if (insertError) {
    console.error('Error inserting affiliation:', insertError);
  }

  return;
}
