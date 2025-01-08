import { getUserProfile } from '@/services/user';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const User = async () => {
  const user = await getUserProfile();

  return (
    <Avatar className="size-7">
      <AvatarImage
        src={user.profile.picture_url ?? ''}
        alt={user.profile.username}
      />
      <AvatarFallback>{user.profile.username[0]}</AvatarFallback>
    </Avatar>
  );
};
