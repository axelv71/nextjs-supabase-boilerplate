import { createAdminClient } from '@/lib/supabase/server';
import Stripe from 'stripe';
import { Enums, Tables } from '@/types/database.types';
import { stripe } from '@/lib/stripe';

const supabase = createAdminClient();

export async function upsertProduct(product: Stripe.Product) {
  const { error } = await supabase.from('products').upsert([
    {
      id: product.id,
      active: product.active,
      name: product.name,
      description: product.description,
      image_url: product.images?.[0] ?? null,
      metadata: product.metadata,
    },
  ]);

  if (error) {
    throw error;
  }
}

export async function upsertPrice(price: Stripe.Price) {
  const { error } = await supabase.from('prices').upsert([
    {
      id: price.id,
      active: price.active,
      description: price.nickname ?? undefined,
      currency: price.currency,
      type: price.type,
      unit_amount: price.unit_amount ?? 0,
      interval: price.recurring?.interval ?? undefined,
      interval_count: price.recurring?.interval_count ?? undefined,
      trial_period_days: price.recurring?.trial_period_days ?? undefined,
      metadata: price.metadata,
      product_id: typeof price.product === 'string' ? price.product : '',
    },
  ]);

  if (error) {
    throw error;
  }
}

export async function manageSubscription(subscription: Stripe.Subscription) {
  const customer = await retrieveCustomer(subscription.customer as string);
  if (!customer) {
    throw new Error('Customer not found');
  }

  console.log('customer', customer);

  const organization = await retrieveOrganizationBySlug(
    subscription.metadata.organizationSlug as string,
    customer.id,
  );
  if (!organization) {
    throw new Error('Organization not found');
  }

  console.log('organization', organization);

  const { error } = await supabase.from('subscriptions').upsert([
    {
      id: subscription.id,
      user_id: customer.id,
      metadata: subscription.metadata,
      status: subscription.status as Enums<'subscription_status'>,
      price_id: subscription.items.data[0].price.id,
      organization_id: organization.id,
      quantity: subscription.items.data[0].quantity,
      cancel_at_period_end: subscription.cancel_at_period_end,
      canceled_at: subscription.canceled_at
        ? toDateTime(subscription.canceled_at).toISOString()
        : null,
      current_period_start: toDateTime(
        subscription.current_period_start,
      ).toISOString(),
      current_period_end: toDateTime(
        subscription.current_period_end,
      ).toISOString(),
      created_at: toDateTime(subscription.created).toISOString(),
      ended_at: subscription.ended_at
        ? toDateTime(subscription.ended_at).toISOString()
        : null,
      trial_start: subscription.trial_start
        ? toDateTime(subscription.trial_start).toISOString()
        : null,
      trial_end: subscription.trial_end
        ? toDateTime(subscription.trial_end).toISOString()
        : null,
    },
  ]);

  if (error) {
    console.error('Error upserting subscription:', error);
    throw error;
  }
}

async function retrieveCustomer(customerId: string) {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('stripe_customer_id', customerId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

async function retrieveOrganizationBySlug(
  organizationSlug: string,
  userId: string,
) {
  const { data, error } = await supabase
    .from('organizations')
    .select('*, organization_members(*)')
    .eq('slug', organizationSlug)
    .single();

  if (error) {
    throw error;
  }

  // Check if the user is a member of the organization
  const isMember = data?.organization_members.some(
    (member: Tables<'organization_members'>) => member.user_id === userId,
  );

  if (!isMember) {
    throw new Error('User is not a member of the organization');
  }

  return data;
}

const toDateTime = (secs: number) => {
  const t = new Date('1970-01-01T00:30:00Z'); // Unix epoch start.
  t.setSeconds(secs);
  return t;
};

export async function createOrRetrieveCustomer(userId: string) {
  const { data, error } = await supabase
    .from('customers')
    .select('stripe_customer_id')
    .eq('id', userId)
    .single();

  if (error) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      throw profileError;
    }

    const customer = await stripe.customers.create({
      email: profile.email,
      name: profile.username ?? undefined,
      metadata: {
        userId: profile.id,
      },
    });

    const { error: insertError } = await supabase.from('customers').insert([
      {
        id: userId,
        stripe_customer_id: customer.id,
      },
    ]);

    if (insertError) {
      throw insertError;
    }

    return customer.id;
  }

  if (data) {
    return data.stripe_customer_id;
  }
}
