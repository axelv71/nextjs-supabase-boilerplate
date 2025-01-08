import { getOrganizationBySlug } from '@/services/organization';
import { Separator } from '@/components/ui/separator';
import { NameSheet } from '@/components/settings/organization/name-sheet';
import { UploadLogo } from '@/components/settings/organization/upload-logo';
import { Suspense } from 'react';

type Props = {
  params: Promise<{
    organization: string;
  }>;
};

export default async function Page(props: Props) {
  const params = await props.params;

  const { organization } = params;

  const { organization: org } = await getOrganizationBySlug(organization);

  return (
    <div className="p-8 space-y-10">
      <div className="space-y-4">
        <h1 className="font-britti text-2xl">Organisation Information</h1>
        <p className="text-[#5F6064]">
          Manage your organisation information, contact, and settings.
        </p>
      </div>
      <Separator />
      <div className="grid grid-cols-6">
        <div className="col-start-1 col-span-6 xl:col-span-3">
          <Suspense>
            <UploadLogo organizationId={org.id} imageUrl={org.image_url} />
          </Suspense>
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-6">
        <div className="col-start-1 col-span-2 space-y-4">
          <h3 className="text-sm font-medium">Organization Name</h3>
          <p className="text-sm text-[#5F6064]">
            Your organization name is used to identify your organization. It is
            displayed in your proposals and invoices.
          </p>
        </div>
        <div className="col-start-5 col-span-2 space-y-4">
          <h3 className="text-sm font-medium">Organization</h3>
          <NameSheet name={org.name} organization={organization} />
        </div>
      </div>
      <Separator />
    </div>
  );
}
