import { Fragment, ReactNode } from 'react';
import NextTopLoader from 'nextjs-toploader';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <Fragment>
      <NextTopLoader
        color="#000"
        shadow="0 0 10px rgba(0,0,0,0.2)"
        showSpinner={false}
      />
      {children}
    </Fragment>
  );
}
