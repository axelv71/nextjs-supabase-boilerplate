export const config = {
  env: {
    site_url: process.env.NEXT_PUBLIC_SITE_URL,
    supabase: {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      serviceRole: process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
    stripe: {
      secret: process.env.STRIPE_SECRET_KEY,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    },
  },
} satisfies IConfig;

interface IConfig {
  env: {
    site_url: string;
    supabase: {
      url: string;
      key: string;
      serviceRole: string;
    };
    stripe: {
      secret: string;
      webhookSecret: string;
    };
  };
}
