import React from 'react';
import { AuthLayout } from '@/components/layout/auth-layout';

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return <AuthLayout>{children}</AuthLayout>;
}
