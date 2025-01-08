import { SlashDivider } from '@/assets/icons';
import { Organization } from '@/components/layout/main-layout/organization';
import { Suspense } from 'react';
import { User } from '@/components/layout/main-layout/user';

type HeaderProps = {
  organization: string;
};

export const Header = ({ organization }: HeaderProps) => {
  return (
    <header className="border-b border-separator px-8 py-5 flex items-center justify-between">
      <div className="flex items-center space-x-1">
        <span className="font-britti text-lg font-medium">ProPal</span>
        <SlashDivider className="size-4 text-[#BBBABF]" />
        <Suspense>
          <Organization organization={organization} />
        </Suspense>
      </div>
      <Suspense>
        <User />
      </Suspense>
    </header>
  );
};
