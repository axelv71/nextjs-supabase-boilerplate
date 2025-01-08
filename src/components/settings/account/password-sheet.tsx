'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PencilLine } from '@/assets/icons';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { useFormStatus } from 'react-dom';
import { updatePassword } from '@/actions/user';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { useState, useActionState } from 'react';

export const PasswordSheet = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [state, action] = useActionState(updatePassword, {
    errors: {},
    success: false,
  });

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <div className="flex space-x-2">
        <Input
          type="password"
          value="&#x2022; &#x2022; &#x2022; &#x2022; &#x2022; &#x2022;"
          disabled
        />
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="w-12 shadow-none">
            <PencilLine className="w-4 h-4 text-[#7F8082] fill-[#EAEAEA]" />
          </Button>
        </SheetTrigger>
      </div>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Change password</SheetTitle>
          <SheetDescription>
            Reset your password to keep your account secure and private
          </SheetDescription>
          <form action={action} className="space-y-6 pt-4">
            {state.success && (
              <Alert variant="success">
                <AlertTitle>Your password has been updated</AlertTitle>
              </Alert>
            )}
            {state.errors?.password && (
              <Alert variant="destructive">
                <AlertTitle>{state.errors.password}</AlertTitle>
              </Alert>
            )}
            {state.errors?.confirmPassword && (
              <Alert variant="destructive">
                <AlertTitle>{state.errors.confirmPassword}</AlertTitle>
              </Alert>
            )}
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                name="password"
                autoComplete="new-password"
                type="password"
                required
                placeholder="&#x2022; &#x2022; &#x2022; &#x2022; &#x2022; &#x2022;"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm new password</Label>
              <Input
                id="confirm-password"
                name="confirmPassword"
                autoComplete="new-password"
                type="password"
                required
                placeholder="&#x2022; &#x2022; &#x2022; &#x2022; &#x2022; &#x2022;"
              />
            </div>
            <Separator />
            <div className="space-x-2">
              <Button variant="outline" type="reset" onClick={handleCancel}>
                Cancel
              </Button>
              <SubmitButton />
            </div>
          </form>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save Changes'}
    </Button>
  );
}
