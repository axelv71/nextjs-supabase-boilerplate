'use server';

import { z } from 'zod';
import { getOrganizationBySlug } from '@/utils/organization';
import { createClient } from '@/lib/supabase/server';
import { createOrRetrieveCustomer } from '@/utils/stripe';
import { stripe } from '@/lib/stripe';
import { config } from '@/config';
import { redirect } from 'next/navigation';

const supabase = createClient();

const createCheckoutSessionSchema = z.object({
  price: z.string(),
  organizationSlug: z.string(),
});

interface CreateCheckoutSessionState {
  errors: {
    price?: string[];
    organizationSlug?: string[];
    _form?: string[];
  };
}

export async function createCheckoutSession(
  prevState: CreateCheckoutSessionState,
  formData: FormData,
): Promise<CreateCheckoutSessionState> {
  const data = createCheckoutSessionSchema.safeParse({
    price: formData.get('price'),
    organizationSlug: formData.get('organizationSlug'),
  });

  if (!data.success) {
    return {
      errors: data.error.flatten().fieldErrors,
    };
  }

  const { data: user, error: userError } = await supabase.auth.getUser();
  if (!user.user || userError) {
    return {
      errors: {
        _form: ['Not authenticated'],
      },
    };
  }

  const organizationSlug = await getOrganizationBySlug(
    data.data.organizationSlug,
  );
  if (!organizationSlug) {
    return {
      errors: {
        organizationSlug: ['Organization not found'],
      },
    };
  }

  const customerId = await createOrRetrieveCustomer(user.user.id);

  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    billing_address_collection: 'required',
    customer: customerId,
    customer_update: {
      name: 'auto',
      address: 'auto',
      shipping: 'auto',
    },
    line_items: [
      {
        price: data.data.price,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    allow_promotion_codes: true,
    subscription_data: {
      metadata: { organizationSlug: data.data.organizationSlug },
    },
    success_url: `${config.env.site_url}/${data.data.organizationSlug}`,
    cancel_url: `${config.env.site_url}/${data.data.organizationSlug}/pricing`,
  });

  if (!stripeSession.url) {
    return {
      errors: {
        _form: ['Something went wrong'],
      },
    };
  }

  redirect(stripeSession.url);
}
