'use client';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { RoundedInput } from '@/components/ui/rounded-input';
import { RoundedButton } from '@/components/ui/rounded-button';
import { AlertCircle, LoaderCircle } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import React, { useActionState } from 'react';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { resetPassword } from '@/actions/auth';

interface ResetPasswordFormProps extends React.HTMLAttributes<HTMLDivElement> {
  email: string;
}

export const ResetPasswordForm = ({
  email,
  className,
  ...props
}: ResetPasswordFormProps) => {
  const [state, action, pending] = useActionState(resetPassword, {
    errors: {},
  });

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form action={action}>
        <div className="grid gap-5">
          <input type="hidden" name="email" value={email} />
          <div className="grid gap-3">
            <Label className="font-medium" htmlFor="code">
              Code
            </Label>
            <RoundedInput
              id="code"
              name="code"
              placeholder="A D 3 G 4 F"
              type="text"
              autoCapitalize="characters"
              autoCorrect="off"
              disabled={pending}
            />
            {state.errors.code && (
              <Alert variant="destructive">
                <AlertTitle>{state.errors.code}</AlertTitle>
              </Alert>
            )}
          </div>
          <div className="grid gap-3">
            <div className="flex justify-between">
              <Label className="font-medium" htmlFor="password">
                New Password
              </Label>
            </div>
            <RoundedInput
              id="password"
              type="password"
              name="password"
              placeholder="New Password"
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
          <div className="grid gap-3">
            <div className="flex justify-between">
              <Label className="font-medium" htmlFor="confirmPassword">
                Confirm Password
              </Label>
            </div>
            <RoundedInput
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect="off"
              disabled={pending}
            />
            {state.errors.confirmPassword && (
              <Alert variant="destructive">
                <AlertTitle>{state.errors.confirmPassword}</AlertTitle>
              </Alert>
            )}
          </div>
          {state.errors._form && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{state.errors._form}</AlertTitle>
            </Alert>
          )}
          <SubmitButton />
        </div>
      </form>
    </div>
  );
};

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <RoundedButton type="submit" disabled={pending}>
      {pending && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
      Reset Password -{'>'}
    </RoundedButton>
  );
};
