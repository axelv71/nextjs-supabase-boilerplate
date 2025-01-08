import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  BarChart12,
  Building07,
  CreditCard02,
  Globe02,
  GraduationHat01,
  Grid01,
  Home02,
  LayersThree01,
  Palette,
  PuzzlePiece01,
  Sale01,
  Settings02,
  UserCircle,
  Users03,
  Zap,
} from '@/assets/icons';
import Link from 'next/link';
import { Fragment } from 'react';
import { Separator } from '@/components/ui/separator';
import { SidebarItem } from '@/components/layout/main-layout/sidebar-item';

type SidebarProps = {
  organization: string;
};

export const AppSidebar = ({ organization }: SidebarProps) => {
  const items = [
    {
      title: 'Overview',
      items: [
        {
          title: 'Dashboard',
          icon: Home02,
          href: `/${organization}`,
        },
      ],
    },
    {
      title: 'Settings',
      items: [
        {
          title: 'Account',
          icon: Settings02,
          href: `/${organization}/settings/account`,
        },
        {
          title: 'Organization',
          icon: Building07,
          href: `/${organization}/settings`,
        },
        {
          title: 'Team',
          icon: Users03,
          href: `/${organization}/settings/team`,
        },
        {
          title: 'Billing',
          icon: CreditCard02,
          href: `/${organization}/billing`,
        },
        {
          title: 'Plan',
          icon: Zap,
          href: `/${organization}/pricing`,
        },
      ],
    },
  ];

  return (
    <Sidebar collapsible="none" variant="sidebar">
      <SidebarContent>
        {items.map((group, index) => (
          <Fragment key={index}>
            <SidebarGroup>
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item, index) => (
                    <SidebarItem href={item.href} key={index}>
                      <item.icon className="fill-[#EAEAEA]" />
                      {item.title}
                    </SidebarItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            {index < items.length - 1 && <Separator />}
          </Fragment>
        ))}
      </SidebarContent>
    </Sidebar>
  );
};
