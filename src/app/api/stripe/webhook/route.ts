import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { config } from '@/config';
import { manageSubscription, upsertPrice, upsertProduct } from '@/utils/stripe';

export async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature');
  const webhookSecret = config.env.stripe.webhookSecret;

  let event: Stripe.Event;
  try {
    if (!signature || !webhookSecret) {
      throw new Error('Stripe signature or webhook secret missing');
    }

    const body = await req.text();

    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    console.error('Webhook Error');
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'product.created':
      case 'product.updated':
        await upsertProduct(event.data.object as Stripe.Product);
        break;
      case 'price.created':
      case 'price.updated':
        await upsertPrice(event.data.object as Stripe.Price);
        break;
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await manageSubscription(event.data.object as Stripe.Subscription);
        break;
      default:
        throw new Error('Unhandled relevant event');
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Webhook handler error' },
      { status: 500 },
    );
  }

  return NextResponse.json({ received: true });
}
