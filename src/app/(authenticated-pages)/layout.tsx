import { Fragment, ReactNode } from 'react';
import { Sidebar } from '@/components/layout/sidebar';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Fragment>
      <Sidebar />
      <main className="sm:ml-72">{children}</main>
    </Fragment>
  );
}
