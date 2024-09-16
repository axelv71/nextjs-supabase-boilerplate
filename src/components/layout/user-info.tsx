import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EllipsisVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogoutItem } from '@/components/layout/logout-item';
import { Separator } from '@/components/ui/separator';
import { getRequiredUser } from '@/utils/auth';

export const UserInfo = async () => {
  const user = await getRequiredUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <Separator className="text-primary-foreground opacity-10" />
          <div className="flex items-center justify-between cursor-pointer px-5 py-5">
            <div className="space-x-2 flex items-center">
              <Avatar className="size-9 mr-1">
                <AvatarImage
                  src={user?.user_metadata.avatar_url}
                  alt="User avatar"
                />
                <AvatarFallback className="text-black text-sm">
                  {user?.user_metadata.full_name
                    ? user.user_metadata.full_name[0]
                    : user?.email?.[0]}
                </AvatarFallback>
              </Avatar>

              <span className="font-bold text-sm">
                {user?.user_metadata.full_name || user?.email}
              </span>
            </div>

            <EllipsisVertical className="size-5" />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right">
        <LogoutItem />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
