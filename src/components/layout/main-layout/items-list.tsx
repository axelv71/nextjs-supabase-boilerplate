import React from 'react';

type ItemsListProps = {
  children: React.ReactNode;
};

export const ItemsList = ({ children }: ItemsListProps) => {
  return <div className="flex flex-col">{children}</div>;
};
