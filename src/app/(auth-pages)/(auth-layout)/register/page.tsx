import React from 'react';
import { Brand } from '@/components/auth/brand';
import { PrimaryBadge } from '@/components/ui/primary-badge';
import { RegisterForm } from '@/components/auth/register-form';
import Link from 'next/link';
import { cookies } from 'next/headers';

export default async function Page() {
  const cookieStore = await cookies();
  const referral = cookieStore.get('referral')?.value;

  return (
    <div className="flex flex-col justify-between h-full space-y-4">
      <Brand />
      <div className="space-y-6">
        <div className="space-y-4 2xl:space-y-5">
          <PrimaryBadge>Sign up</PrimaryBadge>
          <h1 className="font-britti font-medium text-4xl 2xl:text-5xl">
            Build high converting proposals in seconds.
          </h1>
          <p className="text-[#5F6064] tracking-wide">
            ProPal gives you the professionalism & speed to close 40% more deals
            in your agency or freelance activity.
          </p>
        </div>
        <RegisterForm referral={referral} />
      </div>
      <div className="space-y-1">
        <p className="text-sm text-center">
          Already have an account?{' '}
          <Link href="/login" className="underline">
            Log in
          </Link>
        </p>
        <p className="text-sm text-center">
          By signing up you agree to our{' '}
          <Link href="/terms" className="underline">
            Terms
          </Link>{' '}
          &{' '}
          <Link href="/policy" className="underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
