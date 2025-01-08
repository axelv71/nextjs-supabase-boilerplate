import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/server';
import { Brand } from '@/components/auth/brand';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

type Props = {
  searchParams?: Promise<{
    invitationId?: string;
  }>;
};

export default async function Page(props: Props) {
  const supabaseAdmin = createAdminClient();
  const searchParams = await props.searchParams;
  const invitationId = searchParams?.invitationId;

  // If the invitationId is not found, return a 404 page
  if (!invitationId) {
    return notFound();
  }

  // Fetch the invitation data
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

  const url = new URL(`${process.env.NEXT_PUBLIC_SITE_URL}/login`);
  url.searchParams.append('next', `/invitation/${invitationId}`);
  url.searchParams.append('nextActionType', 'invitation');

  return (
    <div className="p-8 flex flex-col items-center justify-between min-h-dvh space-y-10">
      <Brand />
      <div className="flex flex-col items-center space-y-6 max-w-lg">
        <Avatar className="rounded-md size-[100px]">
          <AvatarFallback className="rounded-md text-4xl font-britti">
            {data.organization_name?.[0] || 'O'}
          </AvatarFallback>
          <AvatarImage
            src={organizationImageUrl}
            alt={data.organization_name || ''}
          />
        </Avatar>
        <h3 className="font-britti text-4xl text-center">
          {data.inviter_username} has invited you to {data.organization_name}
        </h3>
        <p className="text-center text-[#5F6064]">
          Propal helps your team create, send high converting proposals, track
          metrics, manage dealflow, and more...
        </p>
        <p className="text-center text-[#5F6064]">
          To accept the invitation, please log in as{' '}
          <span className="text-[#1F1E24] font-medium">
            {data.invited_email}
          </span>
        </p>
        <Button className="w-full items-center" asChild>
          <Link href={url.toString()}>
            Log in <ArrowRight size={16} />
          </Link>
        </Button>
      </div>
      <div></div>
    </div>
  );
}
