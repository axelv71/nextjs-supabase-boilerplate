'use server';

import { createClient } from '@/lib/supabase/server';
import { retrieveUserDefaultOrganization } from '@/services/organization';
import { redirect } from 'next/navigation';
import { Tables } from '@/types/database.types';
import { loops } from '@/lib/loops';

export async function saveOnboarding(options: string[]) {
  const supabase = await createClient();

  // Get users
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user.user) {
    throw userError;
  }

  // Save the options to the database
  const { error } = await supabase.from('onboarding').insert({
    id: user.user.id,
    values: options,
  });
  if (error) {
    throw error;
  }

  const organization = await retrieveUserDefaultOrganization(supabase);

  try {
    // Update the contact in loops
    await loops.updateContact(user.user.email ?? '', {
      role: options[0],
      services: options[1],
      howManyProposals: options[2],
      revenue: options[3],
    });
  } catch (error) {
    console.error('Failed to update contact in loops', error);
  }

  redirect(
    `/${(organization.organizations as unknown as Tables<'organizations'>).slug}`,
  );
}
