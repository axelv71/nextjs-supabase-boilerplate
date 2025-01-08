import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { retrieveUserDefaultOrganization } from '@/services/organization';
import { Tables } from '@/types/database.types';
import { getOnboardingIfCompleted } from '@/services/onboarding';
import { insertContactIfNotExists } from '@/services/loops';
import { cookies } from 'next/headers';
import { linkAffiliate } from '@/services/affiliate';

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/';
  const nextActionType = searchParams.get('nextActionType');

  if (code) {
    const supabase = await createClient();
    const { data: user, error } =
      await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host'); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development';
      const organization = await retrieveUserDefaultOrganization(supabase);
      const onboardingIsCompleted = await getOnboardingIfCompleted(supabase);

      // Check if there is a referral code in the cookies
      const referral = cookieStore.get('referral');
      console.log('referral', referral);
      if (referral) {
        // link the user to the referral
        await linkAffiliate(referral.value, user.user.id, 'sign_up');
        cookieStore.delete('referral');
      }

      // Insert the user into Loops if they don't exist
      if (user?.user?.email) {
        await insertContactIfNotExists(user.user.email, {
          userId: user.user.id,
          email: user.user.email,
          firstName: user.user.user_metadata?.full_name ?? '',
          source: 'Application',
          planName: 'free',
          userGroup: 'User',
        });
      }
      if (isLocalEnv) {
        if (nextActionType === 'invitation') {
          return NextResponse.redirect(`${origin}${next}`);
        }

        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(
          `${origin}/${(organization.organizations as unknown as Tables<'organizations'>).slug}${onboardingIsCompleted ? next : '/onboarding'}`,
        );
      } else if (forwardedHost) {
        if (nextActionType === 'invitation') {
          return NextResponse.redirect(`https://${forwardedHost}${next}`);
        }

        return NextResponse.redirect(
          `https://${forwardedHost}/${(organization.organizations as unknown as Tables<'organizations'>).slug}${onboardingIsCompleted ? next : '/onboarding'}`,
        );
      } else {
        if (nextActionType === 'invitation') {
          return NextResponse.redirect(`${origin}${next}`);
        }

        return NextResponse.redirect(
          `${origin}/${(organization.organizations as unknown as Tables<'organizations'>).slug}${onboardingIsCompleted ? next : '/onboarding'}`,
        );
      }
    }
  }

  // return the user to an error page with instructions
  return notFound();
}
