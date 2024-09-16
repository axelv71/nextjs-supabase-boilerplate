'use client';

import { LogOut } from 'lucide-react';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export const LogoutItem = () => {
  const { push } = useRouter();
  const logout = async () => {
    const supabase = createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
    }

    push('/login');
  };

  return (
    <DropdownMenuItem className="text-red-500" onClick={logout}>
      <LogOut className="size-4 mr-2" />
      <span>Logout</span>
    </DropdownMenuItem>
  );
};
