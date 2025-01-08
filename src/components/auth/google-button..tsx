'use client';

import { RoundedButton } from '@/components/ui/rounded-button';
import Image from 'next/image';
import Google from '@/assets/img/google.png';
import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';

type GoogleButtonProps = {
  next?: string;
  nextActionType?: string;
};

export const GoogleButton = ({ next, nextActionType }: GoogleButtonProps) => {
  const [pending, setPending] = useState<boolean>(false);

  const connectWithGoogle = async () => {
    const supabase = createClient();

    const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`;
    const searchParams = new URLSearchParams();

    if (next) {
      searchParams.set('next', next);
    }

    if (nextActionType) {
      searchParams.set('nextActionType', nextActionType);
    }

    setPending(true);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${url}?${searchParams.toString()}`,
      },
    });
    setPending(false);
  };

  return (
    <RoundedButton
      onClick={connectWithGoogle}
      disabled={pending}
      className="bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#1F1E24]"
    >
      <Image
        src={Google}
        alt="Google"
        width={18}
        height={18}
        className="mr-2"
      />
      Login with Google
    </RoundedButton>
  );
};
