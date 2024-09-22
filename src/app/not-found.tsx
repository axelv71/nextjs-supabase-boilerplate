import { createClient } from '@/lib/supabase/server';
import { retrieveUserDefaultOrganization } from '@/utils/organization';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Tables } from '@/types/database.types';
import { Suspense } from 'react';

export default function NotFound() {
  return (
    <div className="w-full h-screen flex items-center flex-col space-y-4 justify-center">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <Suspense>
        <GoBack />
      </Suspense>
    </div>
  );
}

async function GoBack() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data) {
    return (
      <Button asChild>
        <Link href="/login">Go to login</Link>
      </Button>
    );
  }

  const defaultOrganization = await retrieveUserDefaultOrganization(supabase);

  return (
    <Button asChild>
      <Link
        href={`/${(defaultOrganization.organizations as unknown as Tables<'organizations'>).slug}`}
      >
        Go to Dashboard
      </Link>
    </Button>
  );
}
