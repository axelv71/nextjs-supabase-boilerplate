import { ReactNode } from 'react';

type BadgeProps = {
  children: ReactNode;
};

export const PrimaryBadge = ({ children }: BadgeProps) => {
  return (
    <div className="bg-secondary text-sm font-medium text-secondary-foreground w-fit py-2 px-3 rounded-full">
      {children}
    </div>
  );
};
