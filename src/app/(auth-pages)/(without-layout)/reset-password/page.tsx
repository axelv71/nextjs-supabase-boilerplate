import React from 'react';
import { Brand } from '@/components/auth/brand';
import { PrimaryBadge } from '@/components/ui/primary-badge';
import Link from 'next/link';
import { Stepper } from '@/components/ui/stepper';
import { notFound } from 'next/navigation';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';

export default async function Page(props: {
  searchParams?: Promise<{ email?: string }>;
}) {
  const searchParams = await props.searchParams;
  const email = searchParams?.email?.toString();

  if (!email) {
    notFound();
  }

  return (
    <div className="p-8 flex flex-col items-center justify-between min-h-dvh">
      <Brand />
      <div className="space-y-6 max-w-[450px] w-full">
        <div className="flex flex-col items-center space-y-6">
          <PrimaryBadge>Forgot Password?</PrimaryBadge>
          <h1 className="font-britti font-medium text-4xl 2xl:text-5xl text-center">
            Check your email.
          </h1>
          <p className="text-[#5F6064] tracking-wide text-center">
            We have sent you a reset code at {email}
          </p>
        </div>
        <ResetPasswordForm email={email} />
      </div>
      <div className="space-y-3 max-w-[450px] w-full">
        <p className="text-sm text-center">
          {'You made a mistake on your email? Get Back to '}
          <Link href="/forgot-password" className="underline">
            Reset Password
          </Link>
        </p>
        <Stepper activeStep={1} length={2} />
      </div>
    </div>
  );
}
