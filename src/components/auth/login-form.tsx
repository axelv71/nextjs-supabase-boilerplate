'use client';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { RoundedInput } from '@/components/ui/rounded-input';
import { RoundedButton } from '@/components/ui/rounded-button';
import { LoaderCircle } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import React, { useActionState } from 'react';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { login } from '@/actions/auth';
import { GoogleButton } from '@/components/auth/google-button.';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {
  next?: string;
  nextActionType?: string;
}

export const LoginForm = ({
  className,
  next,
  nextActionType,
  ...props
}: LoginFormProps) => {
  const [state, action, pending] = useActionState(login, {
    errors: {},
  });

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form action={action}>
        <input type="hidden" name="next" value={next} />
        <div className="grid gap-5">
          <div className="grid gap-3">
            <Label className="font-medium" htmlFor="email">
              Email
            </Label>
            <RoundedInput
              id="email"
              name="email"
              placeholder="email@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={pending}
            />
            {state.errors.email && (
              <Alert variant="destructive">
                <AlertTitle>{state.errors.email}</AlertTitle>
              </Alert>
            )}
          </div>
          <div className="grid gap-3">
            <div className="flex justify-between">
              <Label className="font-medium" htmlFor="password">
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-normal hover:underline"
              >
                Forgot Password
              </Link>
            </div>
            <RoundedInput
              id="password"
              type="password"
              name="password"
              placeholder="&#x2022; &#x2022; &#x2022; &#x2022; &#x2022; &#x2022;"
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect="off"
              disabled={pending}
            />
            {state.errors.password && (
              <Alert variant="destructive">
                <AlertTitle>{state.errors.password}</AlertTitle>
              </Alert>
            )}
          </div>
          {state.errors._form && (
            <Alert variant="destructive">
              <AlertTitle>{state.errors._form}</AlertTitle>
            </Alert>
          )}
          <SubmitButton />
        </div>
      </form>
      <div className="relative">
        <Separator />
        <span className="absolute left-1/2 text-center -translate-x-1/2 w-8 bg-white -top-3">
          or
        </span>
      </div>
      <GoogleButton next={next} nextActionType={nextActionType} />
    </div>
  );
};

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <RoundedButton type="submit" disabled={pending}>
      {pending && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
      Login in with email -{'>'}
    </RoundedButton>
  );
};
