'use server';

import { z } from 'zod';
import { createAdminClient, createClient } from '@/lib/supabase/server';
import {
  getOrganizationBySlug,
  retrieveUserDefaultOrganization,
} from '@/services/organization';
import { config } from '@/config';
import { loops } from '@/lib/loops';
import { getUserProfile } from '@/services/user';
import { Enums } from '@/types/database.types';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const inviteUsersSchema = z.object({
  organization: z
    .string()
    .min(4, 'Organization number must be at least 6 characters'),
  emails: z
    .string()
    .transform(
      (value) =>
        value
          .split(';') // Split by ";"
          .map((email) => email.trim()), // Trim spaces
    )
    .refine(
      (emails) =>
        emails.every(
          (email) =>
            z.string().email('Invalid email format').safeParse(email).success,
        ),
      {
        message: 'One or more emails are invalid',
      },
    ),
});

interface InviteUsersState {
  errors?: {
    emails?: string[];
    organization?: string[];
    _form?: string[];
  };
  success?: boolean;
}

export async function inviteUsers(
  state: InviteUsersState,
  formData: FormData,
): Promise<InviteUsersState> {
  const supabase = await createClient();

  const result = inviteUsersSchema.safeParse({
    organization: formData.get('organization'),
    emails: formData.get('emails'),
  });
  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  // Get User
  const user = await getUserProfile();

  // Get organization
  const { organization } = await getOrganizationBySlug(
    result.data.organization,
  );

  const errors = [];
  // Loop through each email
  for (const email of result.data.emails) {
    // Get the user ID of the user who is inviting
    let invitedUser = null;
    try {
      invitedUser = await setupInviteUserDetails(email);
    } catch (error) {
      return {
        errors: {
          _form: ['Error inviting user'],
        },
      };
    }

    // Check if already invited
    const { data: existingInvites, error: errorExistingInvites } =
      await supabase
        .from('organization_invitations')
        .select('id')
        .eq('organization_id', organization.id)
        .eq('invited_user_id', invitedUser.userId)
        .eq('status', 'active');
    if (errorExistingInvites) {
      errors.push(`Error checking ${email} existing invites`);
      continue;
    }

    if (existingInvites.length > 0) {
      errors.push(`${email} already has an active invitation`);
      continue;
    }

    // Insert the invitation
    const { data: newInvitation, error: errorNewInvitation } = await supabase
      .from('organization_invitations')
      .insert({
        invited_user_email: email,
        invited_user_id: invitedUser.userId,
        inviter_user_id: user.user?.id,
        organization_id: organization.id,
        invited_user_role: 'member',
      })
      .select('*')
      .single();
    if (errorNewInvitation) {
      errors.push(`Error inviting ${email}`);
      continue;
    }

    // Get the invitation URL
    const invitationUrl = await getViewInvitationUrl(
      newInvitation.id,
      invitedUser,
      result.data.emails[0],
    );

    const loopsResp = await loops.sendTransactionalEmail({
      transactionalId: config.env.loops.organizationInvitationTransactionalId,
      email: email,
      dataVariables: {
        organizationName: organization.name,
        inviterName: user.profile.username,
        invitationUrl,
      },
    });
    if (!loopsResp.success) {
      errors.push(`Error sending email to ${email}`);
    }
  }

  revalidatePath('/[organization]/settings/team', 'layout');

  if (errors.length > 0) {
    return {
      errors: {
        _form: errors,
      },
    };
  }

  return {
    success: true,
  };
}

async function setupInviteUserDetails(email: string): Promise<{
  type: 'USER_CREATED' | 'USER_EXISTS';
  userId: string;
}> {
  const supabaseAdmin = createAdminClient();

  // Check if the user already exists
  const { data: user, error: errorUser } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('email', email)
    .range(0, 0);
  if (errorUser) {
    throw new Error('Error fetching user');
  }

  // Return the user ID if the user already exists
  if (user.length > 0) {
    return { type: 'USER_EXISTS', userId: user[0].id };
  }

  // Create a new user
  const { data: newUser, error: errorNewUser } =
    await supabaseAdmin.auth.admin.createUser({
      email,
    });
  if (errorNewUser) {
    console.error(errorNewUser);
    throw new Error('Error creating user');
  }

  return { type: 'USER_CREATED', userId: newUser.user?.id || '' };
}

async function getViewInvitationUrl(
  invitationId: string,
  inviteeDetails: {
    type: 'USER_CREATED' | 'USER_EXISTS';
    userId: string;
  },
  email: string,
): Promise<string> {
  if (inviteeDetails.type === 'USER_CREATED') {
    throw new Error('Not implemented');
  }

  return `${config.env.site_url}/api/invitation/view/${invitationId}`;
}

export async function declineInvitation(invitationId: string) {
  const supabase = await createClient();

  // Update the invitation
  const { error: errorUpdatedInvitation } = await supabase
    .from('organization_invitations')
    .update({
      status: 'declined',
    })
    .eq('id', invitationId);
  if (errorUpdatedInvitation) {
    throw new Error('Error updating invitation');
  }

  const organization = await retrieveUserDefaultOrganization(supabase);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return redirect(`/${organization.organizations.slug}`);
}

export async function acceptInvitation(invitationId: string) {
  const supabase = await createClient();

  // Get the invitation
  const { data: invitation, error: errorInvitation } = await supabase
    .from('organization_invitations')
    .select('*')
    .eq('id', invitationId)
    .eq('status', 'active')
    .single();
  if (errorInvitation) {
    throw new Error('Error fetching invitation');
  }

  // Update the invitation
  const { error: errorUpdatedInvitation } = await supabase
    .from('organization_invitations')
    .update({
      status: 'accepted',
    })
    .eq('id', invitationId)
    .single();
  if (errorUpdatedInvitation) {
    throw new Error('Error updating invitation');
  }

  // Insert the user into the organization
  await addUserToOrganization(
    invitation.invited_user_id || '',
    invitation.organization_id,
    invitation.invited_user_role,
  );

  // Fetch the organization
  const { data: organization, error: errorOrganization } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', invitation.organization_id)
    .single();
  if (errorOrganization) {
    throw new Error('Error fetching organization');
  }

  return redirect(`/${organization.slug}`);
}

async function addUserToOrganization(
  user_id: string,
  organization_id: string,
  role: Enums<'organization_member_role'>,
) {
  const supabaseAdminClient = createAdminClient();

  // Check if the user is already in the organization
  const { data: existingUsers, error: errorExistingUsers } =
    await supabaseAdminClient
      .from('organization_members')
      .select('*')
      .eq('user_id', user_id)
      .eq('organization_id', organization_id)
      .range(0, 0);

  if (errorExistingUsers) {
    console.error(errorExistingUsers);
    throw new Error('Error checking existing users');
  }

  if (existingUsers.length > 0) {
    throw new Error('User already in organization');
  }

  // Insert the user into the organization
  const { error: errorInsertUser } = await supabaseAdminClient
    .from('organization_members')
    .insert({
      user_id,
      organization_id,
      role: role,
    });

  if (errorInsertUser) {
    throw new Error('Error inserting user');
  }
}

export async function revokeInvitation(invitationId: string) {
  const supabase = await createClient();
  const user = await getUserProfile();

  // Get invitation
  const { data: invitation, error: errorInvitation } = await supabase
    .from('organization_invitations')
    .select('*')
    .eq('id', invitationId)
    .single();
  if (errorInvitation) {
    throw new Error('Error fetching invitation');
  }

  // Check if current user is admin or owner
  const { data: member, error: errorMember } = await supabase
    .from('organization_members')
    .select('role')
    .eq('user_id', user.user?.id)
    .eq('organization_id', invitation.organization_id)
    .single();

  if (errorMember) {
    throw new Error('Error fetching member');
  }
  if (member.role !== 'owner' && member.role !== 'admin') {
    throw new Error('Not authorized');
  }

  // Update the invitation
  const { error: errorUpdatedInvitation } = await supabase
    .from('organization_invitations')
    .update({
      status: 'inactive',
    })
    .eq('id', invitationId);

  if (errorUpdatedInvitation) {
    throw new Error('Error updating invitation');
  }

  revalidatePath('/[organization]/settings/team', 'layout');
}
