'use client';

import { Button } from '@/components/ui/button';
import { useFormStatus, useFormState } from 'react-dom';
import { createCheckoutSession } from '@/actions/stripe';

type CreateCheckoutProps = {
  priceId: string;
  organizationSlug: string;
};

export const CreateCheckoutButton = ({
  priceId,
  organizationSlug,
}: CreateCheckoutProps) => {
  const [formState, action] = useFormState(createCheckoutSession, {
    errors: {},
  });

  return (
    <form action={action}>
      {formState.errors._form && (
        <div className="text-red-500">{formState.errors._form}</div>
      )}
      {formState.errors.price && (
        <div className="text-red-500">{formState.errors.price}</div>
      )}
      <input name="organizationSlug" type="hidden" value={organizationSlug} />
      <input name="price" type="hidden" value={priceId} />
      <SubmitButton />
    </form>
  );
};

export const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button size="lg" className="w-full" disabled={pending}>
      Get started {pending && '...'}
    </Button>
  );
};
