import 'server-only';

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
    loops: {
      key: process.env.LOOPS_API_KEY,
      organizationInvitationTransactionalId:
        process.env.LOOPS_ORG_INVITE_TRANSACTIONAL_ID,
    },
    posthog: {
      key: process.env.NEXT_PUBLIC_POSTHOG_KEY,
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
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
    loops: {
      key: string;
      organizationInvitationTransactionalId: string;
    };
    posthog: {
      key: string;
      host: string;
    };
  };
}
