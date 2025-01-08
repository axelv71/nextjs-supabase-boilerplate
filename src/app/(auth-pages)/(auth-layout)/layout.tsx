import React from 'react';
import { AuthLayout } from '@/components/layout/auth-layout';

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return <AuthLayout>{children}</AuthLayout>;
}
