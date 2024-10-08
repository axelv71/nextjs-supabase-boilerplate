import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { retrieveUserDefaultOrganization } from '@/utils/organization';
import { Tables } from '@/types/database.types';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host'); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development';
      const organization = await retrieveUserDefaultOrganization(supabase);
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(
          `${origin}/${(organization.organizations as unknown as Tables<'organizations'>).slug}${next}`,
        );
      } else if (forwardedHost) {
        return NextResponse.redirect(
          `https://${forwardedHost}/${(organization.organizations as unknown as Tables<'organizations'>).slug}${next}`,
        );
      } else {
        return NextResponse.redirect(
          `${origin}/${(organization.organizations as unknown as Tables<'organizations'>).slug}${next}`,
        );
      }
    }
  }

  // return the user to an error page with instructions
  return notFound();
}
