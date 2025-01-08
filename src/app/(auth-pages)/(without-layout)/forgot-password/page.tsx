import React from 'react';
import { Brand } from '@/components/auth/brand';
import { PrimaryBadge } from '@/components/ui/primary-badge';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';
import Link from 'next/link';
import { Stepper } from '@/components/ui/stepper';

export default function Page() {
  return (
    <div className="p-8 flex flex-col items-center justify-between min-h-dvh">
      <Brand />
      <div className="space-y-6 max-w-[450px] w-full">
        <div className="flex flex-col items-center space-y-6">
          <PrimaryBadge>Forgot Password?</PrimaryBadge>
          <h1 className="font-britti font-medium text-4xl 2xl:text-5xl text-center">
            Reset Password.
          </h1>
          <p className="text-[#5F6064] tracking-wide text-center">
            Enter your email address, and we’ll send instructions to reset your
            password.
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
      <div className="space-y-3 max-w-[450px] w-full">
        <p className="text-sm text-center">
          {'Don’t need to reset your password? Get Back to '}
          <Link href="/login" className="underline">
            Log in
          </Link>
        </p>
        <Stepper activeStep={0} length={2} />
      </div>
    </div>
  );
}
