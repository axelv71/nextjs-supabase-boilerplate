'use client';

import React, { useActionState } from 'react';
import { cn } from '@/lib/utils';
import { RoundedInput } from '@/components/ui/rounded-input';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { ArrowRight, LoaderCircle } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { forgotPassword } from '@/actions/auth';
import { RoundedButton } from '@/components/ui/rounded-button';

interface ResetPasswordFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ForgotPasswordForm = ({
  className,
  ...props
}: ResetPasswordFormProps) => {
  const [state, action, pending] = useActionState(forgotPassword, {
    errors: {},
  });

  return (
    <div className={cn('grid gap-3 w-full', className)} {...props}>
      <form action={action}>
        <div className="space-y-5">
          <div className="grid gap-3">
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
          <div className="space-y-3">
            <SubmitButton />
          </div>
        </div>
      </form>
    </div>
  );
};

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <RoundedButton type="submit" disabled={pending} className="w-full">
      {pending && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
      Get Code <ArrowRight className="ml-2 h-4 w-4" />
    </RoundedButton>
  );
};
