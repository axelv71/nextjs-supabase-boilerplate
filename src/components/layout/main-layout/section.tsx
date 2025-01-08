import React from 'react';

type SectionProps = {
  children: React.ReactNode;
};

export const Section = ({ children }: SectionProps) => {
  return (
    <span className="font-inter text-sm pb-3 font-medium text-[#5F6064]">
      {children}
    </span>
  );
};
