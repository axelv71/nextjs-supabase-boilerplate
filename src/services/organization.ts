import { createClient } from '@/lib/supabase/server';
import { Tables } from '@/types/database.types';
import { notFound } from 'next/navigation';
import { SupabaseClient } from '@supabase/supabase-js';

export async function getOrganizationBySlug(slug: string) {
  const supabase = await createClient();

  // Check if the user is a member of the organization
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (!user || userError) {
    throw new Error('User not found');
  }

  const { data, error } = await supabase
    .from('organizations')
    .select('id, name, slug, image_url, organization_members(*)')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching organization:', error);
    notFound();
  }

  if (!data) {
    throw new Error('Organization not found');
  }

  // Check if the user is a member of the organization
  const isMember = data.organization_members.some(
    (member: Tables<'organization_members'>) =>
      member.user_id === user.user?.id,
  );

  if (!isMember) {
    notFound();
  }

  const userRole = data.organization_members.find(
    (member: Tables<'organization_members'>) =>
      member.user_id === user.user?.id,
  )?.role;
  if (!userRole) {
    throw new Error('User role not found');
  }

  // Create a signed URL for the organization logo
  if (data.image_url) {
    const { data: signedUrlData, error: signedUrlError } =
      await supabase.storage
        .from('organizations_logo')
        .createSignedUrl(data.image_url, 3600, {
          transform: {
            width: 500,
            height: 500,
          },
        });

    if (signedUrlError) {
      console.error('Error creating signed URL:', signedUrlError);
    }

    data.image_url = signedUrlData?.signedUrl || null;
  }

  return {
    organization: data,
    userRole,
  };
}

export async function retrieveUserDefaultOrganization(
  supabase: SupabaseClient,
) {
  // Check if the user is a member of the organization
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (!user || userError) {
    throw new Error('User not found');
  }

  const { data, error } = await supabase
    .from('organization_members')
    .select('organization_id, role, organizations!organization_id(*)')
    .eq('user_id', user.user?.id)
    .eq('role', 'owner')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error('Organization not found');
  }

  return data;
}
