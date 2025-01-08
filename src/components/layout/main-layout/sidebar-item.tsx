'use client';

import { ReactNode } from 'react';
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type SidebarItemProps = {
  children: ReactNode;
  href: string;
};

export const SidebarItem = ({ children, href }: SidebarItemProps) => {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <SidebarMenuItem
      className={cn(active ? 'bg-[#F3F3F3] text-foreground rounded-lg' : '')}
    >
      <SidebarMenuButton asChild>
        <Link href={href}>{children}</Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
