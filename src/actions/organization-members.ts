'use server';

import { createClient } from '@/lib/supabase/server';
import { getOrganizationBySlug } from '@/services/organization';
import { revalidatePath } from 'next/cache';
import { Enums } from '@/types/database.types';

export async function removeOrganizationMember(
  organization: string,
  memberId: string,
) {
  const supabase = await createClient();
  const { organization: org, userRole } =
    await getOrganizationBySlug(organization);

  if (userRole !== 'owner' && userRole !== 'admin') {
    throw new Error('You do not have permission to remove members');
  }

  const { error } = await supabase
    .from('organization_members')
    .delete()
    .eq('organization_id', org.id)
    .eq('user_id', memberId);

  if (error) {
    throw new Error('Failed to remove member');
  }

  revalidatePath('/[organization]/settings/team', 'layout');
}

export async function changeRole(
  organization: string,
  memberId: string,
  role: Enums<'organization_member_role'>,
) {
  const supabase = await createClient();
  const { organization: org, userRole } =
    await getOrganizationBySlug(organization);

  // Get the current member
  const { data: member, error: memberError } = await supabase
    .from('organization_members')
    .select('role')
    .eq('organization_id', org.id)
    .eq('user_id', memberId)
    .single();
  if (memberError) {
    throw new Error('Failed to get member');
  }

  // Check if the user is allowed to change the role
  if (userRole !== 'owner' && userRole !== 'admin') {
    throw new Error('You do not have permission to change roles');
  }

  // Check if the user is trying to change the role of an owner
  if (member?.role === 'owner' && userRole !== 'owner') {
    throw new Error('You cannot change the role of an owner');
  }

  // Update the role
  const { error } = await supabase
    .from('organization_members')
    .update({ role })
    .eq('organization_id', org.id)
    .eq('user_id', memberId);

  if (error) {
    throw new Error('Failed to change role');
  }

  revalidatePath('/[organization]/settings/team', 'layout');
}
