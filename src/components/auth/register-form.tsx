'use client';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { RoundedInput } from '@/components/ui/rounded-input';
import { RoundedButton } from '@/components/ui/rounded-button';
import { LoaderCircle } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import React, { useActionState } from 'react';
import { signUp } from '@/actions/auth';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { GoogleButton } from '@/components/auth/google-button.';
import { Separator } from '@/components/ui/separator';

interface RegisterFormProps extends React.HTMLAttributes<HTMLDivElement> {
  referral?: string;
}

export const RegisterForm = ({
  className,
  referral,
  ...props
}: RegisterFormProps) => {
  const [state, action, pending] = useActionState(signUp, {
    errors: {},
  });

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form action={action}>
        <input type="hidden" name="referral" value={referral} />
        <div className="grid gap-5">
          <div className="grid gap-3">
            <Label className="font-medium" htmlFor="name">
              Full Name
            </Label>
            <RoundedInput
              id="name"
              name="name"
              placeholder="John Doe"
              type="text"
              autoCapitalize="none"
              autoComplete="name"
              autoCorrect="off"
              disabled={pending}
            />
            {state.errors.name && (
              <Alert variant="destructive">
                <AlertTitle>{state.errors.name}</AlertTitle>
              </Alert>
            )}
          </div>
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
            <Label className="font-medium" htmlFor="password">
              Password
            </Label>
            <RoundedInput
              id="password"
              type="password"
              name="password"
              autoCapitalize="none"
              autoComplete="password"
              placeholder="&#x2022; &#x2022; &#x2022; &#x2022; &#x2022; &#x2022;"
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
      <GoogleButton />
    </div>
  );
};

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <RoundedButton type="submit" disabled={pending}>
      {pending && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
      Get started with email -&gt;
    </RoundedButton>
  );
};
