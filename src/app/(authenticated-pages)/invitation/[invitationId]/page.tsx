import { createAdminClient } from '@/lib/supabase/server';
import { getUserProfile } from '@/services/user';
import { notFound } from 'next/navigation';
import { Brand } from '@/components/auth/brand';
import React, { Suspense } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { JoinButton } from '@/components/invitation/join-button';
import { DeclineButton } from '@/components/invitation/decline-button';

type Props = {
  params: Promise<{
    invitationId: string;
  }>;
};

export default async function Page(props: Props) {
  const { invitationId } = await props.params;

  const supabaseAdmin = createAdminClient();
  const user = await getUserProfile();

  const { data, error } = await supabaseAdmin
    .from('organization_invitations_view')
    .select('*')
    .eq('invitation_id', invitationId)
    .eq('invitation_status', 'active')
    .single();
  if (error || !data) {
    console.log('data', data);
    console.error(error);
    return notFound();
  }

  let organizationImageUrl = undefined;
  if (data.organization_image_url) {
    const { data: signedUrlData, error: signedUrlError } =
      await supabaseAdmin.storage
        .from('organizations_logo')
        .createSignedUrl(data.organization_image_url, 3600, {
          transform: {
            width: 500,
            height: 500,
          },
        });
    if (signedUrlError) {
      console.error('Error creating signed URL:', signedUrlError);
    }

    organizationImageUrl = signedUrlData?.signedUrl;
  }

  if (user.user?.id !== data.invited_user_id) {
    return notFound();
  }

  return (
    <div className="p-8 flex flex-col items-center justify-between min-h-dvh space-y-10">
      <Brand />
      <div className="space-y-4">
        <h3 className="text-center text-2xl font-britti">
          You have access to these organisations
        </h3>
        <div className="w-full border border-border/50 p-4 rounded-lg space-y-4 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="rounded-md size-14">
                <AvatarFallback className="rounded-lg font-britti">
                  {data.organization_name?.[0] || 'O'}
                </AvatarFallback>
                <AvatarImage
                  src={organizationImageUrl}
                  alt={data.organization_name || ''}
                />
              </Avatar>
              <div className="flex flex-col space-y-1.5">
                <h6 className="font-medium">{data.organization_name}</h6>
                <p className="text-[#5F6064] text-sm">
                  {data.organization_member_count} member(s)
                </p>
              </div>
            </div>

            <Suspense>
              <JoinButton invitationId={invitationId} />
            </Suspense>
          </div>
          <Separator />
          <Suspense>
            <DeclineButton invitationId={invitationId} />
          </Suspense>
        </div>
      </div>
      <div></div>
    </div>
  );
}
