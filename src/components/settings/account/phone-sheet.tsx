'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PencilLine, Plus } from '@/assets/icons';
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
import { updatePhone } from '@/actions/user';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { useState, useActionState } from 'react';
import { PhoneInput } from '@/components/ui/phone-input';
import { formatPhoneNumberIntl } from 'react-phone-number-input';

type PhoneSheetProps = {
  phone: string;
};

export const PhoneSheet = ({ phone }: PhoneSheetProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [number, setNumber] = useState<string>(phone);
  const [state, action] = useActionState(updatePhone, {
    errors: {},
    success: false,
  });

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <div className="flex space-x-2">
        <Input value={phone} placeholder="Add phone number" disabled />
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="w-12 shadow-none">
            {phone ? (
              <PencilLine className="w-4 h-4 text-[#7F8082] fill-[#EAEAEA]" />
            ) : (
              <Plus className="w-10 h-10" />
            )}
          </Button>
        </SheetTrigger>
      </div>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Phone Number</SheetTitle>
          <SheetDescription>
            Your billing information & proposal updates will be sent to this
            email address
          </SheetDescription>
          <form action={action} className="space-y-6 pt-4">
            {state.success && (
              <Alert variant="success">
                <AlertTitle>Your phone number has been updated</AlertTitle>
              </Alert>
            )}
            {state.errors?.phone && (
              <Alert variant="destructive">
                <AlertTitle>{state.errors.phone}</AlertTitle>
              </Alert>
            )}
            <Separator />
            <div className="space-y-2">
              <input
                type="hidden"
                name="phone"
                value={formatPhoneNumberIntl(number)}
              />
              <Label htmlFor="email">New phone number</Label>
              <PhoneInput
                value={number}
                onChange={setNumber}
                placeholder="Enter your phone number"
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
