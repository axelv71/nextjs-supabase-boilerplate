import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const supabase = createAdminClient();
  const cookieStore = await cookies();
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (code) {
    // Fetch the user with the given code
    const { data: referral } = await supabase
      .from('promotional_codes')
      .select('*')
      .eq('code', code)
      .single();

    if (referral && referral.referer_id) {
      cookieStore.set('referral', referral.referer_id);
    }
  }

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/`);
}
