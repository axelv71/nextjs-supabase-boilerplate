import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EllipsisVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogoutItem } from '@/components/layout/logout-item';
import { Separator } from '@/components/ui/separator';
import { getUserProfile } from '@/utils/user';

export const UserInfo = async () => {
  const userProfile = await getUserProfile();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <Separator className="text-primary-foreground opacity-10" />
          <div className="flex items-center justify-between cursor-pointer px-5 py-5">
            <div className="space-x-2 flex items-center">
              <Avatar className="size-9 mr-1">
                <AvatarImage
                  src={userProfile.profile.picture_url || ''}
                  alt="User avatar"
                />
                <AvatarFallback className="text-black text-sm">
                  {userProfile.profile.username?.[0] ||
                    userProfile.profile.email[0]}
                </AvatarFallback>
              </Avatar>
              <span className="font-bold text-sm">
                {userProfile.profile.username || userProfile.profile.email}
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
