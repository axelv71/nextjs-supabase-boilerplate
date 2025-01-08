import { getOrganizationBySlug } from '@/services/organization';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type OrganizationProps = {
  organization: string;
};

export const Organization = async ({ organization }: OrganizationProps) => {
  const org = await getOrganizationBySlug(organization);

  return (
    <div className="flex items-center space-x-2">
      <Avatar className="size-4">
        <AvatarImage
          src={org.organization.image_url ?? ''}
          alt={org.organization.name}
        />
        <AvatarFallback className="text-xs bg-[#CCCCCC]"></AvatarFallback>
      </Avatar>
      <span className="font-britti text-sm">{org.organization.name}</span>
    </div>
  );
};
