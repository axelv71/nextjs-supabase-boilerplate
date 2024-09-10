'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Google from '@/assets/img/google.png';
import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';

export const GoogleButton = () => {
  const [pending, setPending] = useState<boolean>(false);

  const connectWithGoogle = async () => {
    const supabase = createClient();

    setPending(true);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`,
      },
    });
    setPending(false);
  };

  return (
    <Button variant="outline" onClick={connectWithGoogle} disabled={pending}>
      <Image
        src={Google}
        alt="Google"
        width={18}
        height={18}
        className="mr-2"
      />
      Google
    </Button>
  );
};
