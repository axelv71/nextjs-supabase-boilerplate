import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { config } from '@/config';
import { redirect } from 'next/navigation';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ invitationId: string }> },
) {
  const { invitationId } = await params;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw error;
  }
  const user = data?.user;

  if (!user) {
    const url = new URL(`${config.env.site_url}/invitation/login`);
    url.searchParams.append('invitationId', invitationId);

    return redirect(url.toString());
  }

  // Check if the invitation is directed to the user
  const { data: invitationData, error: invitationError } = await supabase
    .from('organization_invitations')
    .select('*')
    .eq('id', invitationId)
    .eq('invited_user_id', user.id)
    .eq('status', 'active');

  if (invitationError) {
    throw invitationError;
  }

  if (!invitationData || invitationData.length === 0) {
    return redirect(
      `${config.env.site_url}/invitation/login?invitationId=${invitationId}`,
    );
  }

  return redirect(`${config.env.site_url}/invitation/${invitationId}`);
}
