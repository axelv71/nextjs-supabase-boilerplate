import { ReactNode } from 'react';
import { Header } from '@/components/layout/main-layout/header';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/main-layout/app-sidebar';

type LayoutProps = {
  children: ReactNode;
  params: Promise<{
    organization: string;
  }>;
};

export default async function Layout(props: LayoutProps) {
  const params = await props.params;

  const { children } = props;

  return (
    <SidebarProvider>
      <div className="h-screen w-full flex flex-col">
        <Header organization={params.organization} />
        <div className="flex flex-1 min-h-0">
          <AppSidebar organization={params.organization} />
          <main className="w-full overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
