import { Brand } from '@/components/auth/brand';
import { PrimaryBadge } from '@/components/ui/primary-badge';
import Link from 'next/link';
import React from 'react';
import { LoginForm } from '@/components/auth/login-form';
import { Alert, AlertTitle } from '@/components/ui/alert';

export default async function Page(props: {
  searchParams?: Promise<{
    email?: string;
    next?: string;
    nextActionType?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const email = searchParams?.email?.toString();
  const next = searchParams?.next?.toString();
  const nextActionType = searchParams?.nextActionType?.toString();

  return (
    <div className="flex flex-col justify-between h-full space-y-4">
      <Brand />
      <div className="space-y-6">
        <div className="space-y-4 2xl:space-y-5">
          <PrimaryBadge>Log in</PrimaryBadge>
          <h1 className="font-britti font-medium text-4xl 2xl:text-5xl">
            Welcome Back.
          </h1>
          <p className="text-[#5F6064] tracking-wide">
            Let’s close more deals today!
          </p>
        </div>
        {email && (
          <Alert variant="success">
            <AlertTitle>
              Check your email at <span className="font-bold">{email}</span> to
              confirm your account.
            </AlertTitle>
          </Alert>
        )}
        <LoginForm next={next} nextActionType={nextActionType} />
      </div>
      <div className="space-y-1">
        <p className="text-sm text-center">
          {"Don't have an account? "}
          <Link href="/register" className="underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
