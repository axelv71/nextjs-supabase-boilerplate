// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { Database, Tables } from '../database.types.ts';
import { Stripe } from 'npm:stripe@16.12.0';

type InsertWebhookPayload = {
  type: 'INSERT';
  table: string;
  schema: string;
  record: Tables<'profiles'>;
  old_record: Tables<'profiles'>;
};

const supabase = createClient<Database>(
  // eslint-disable-next-line no-undef
  Deno.env.get('SUPABASE_URL')!,
  // eslint-disable-next-line no-undef
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// eslint-disable-next-line no-undef
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!);

// eslint-disable-next-line no-undef
Deno.serve(async (req) => {
  const payload: InsertWebhookPayload = await req.json();

  // Create a new Stripe promotion code
  const promotionCode = await stripe.promotionCodes.create({
    // eslint-disable-next-line no-undef
    coupon: Deno.env.get('STRIPE_AFFILIATE_PROGRAM_CODE')!,
  });

  const { data: promoCodeSupa, error } = await supabase
    .from('promotional_codes')
    .insert({
      id: promotionCode.id,
      coupon_id: promotionCode.coupon.id,
      code: promotionCode.code,
      referer_id: payload.record.id,
    })
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify(error), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify(promoCodeSupa), {
    headers: { 'Content-Type': 'application/json' },
  });
});
