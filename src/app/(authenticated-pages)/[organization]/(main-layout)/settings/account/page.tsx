import { Separator } from '@/components/ui/separator';
import { EmailSheet } from '@/components/settings/account/email-sheet';
import { getUserProfile } from '@/services/user';
import { PasswordSheet } from '@/components/settings/account/password-sheet';
import { PhoneSheet } from '@/components/settings/account/phone-sheet';
import { Suspense } from 'react';
import { UploadAvatar } from '@/components/settings/account/upload-avatar';

export default async function Page() {
  const user = await getUserProfile();

  return (
    <div className="p-8 space-y-10">
      <div className="space-y-4">
        <h1 className="font-britti text-2xl">Account Settings</h1>
        <p className="text-[#5F6064]">
          Manage your account information, contact, and password.
        </p>
      </div>
      <Separator />
      <div className="grid grid-cols-6">
        <div className="col-start-1 col-span-6 xl:col-span-3">
          <Suspense>
            <UploadAvatar userId={user.user?.id} imageUrl={user.profile.picture_url} />
          </Suspense>
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-6">
        <div className="col-start-1 col-span-2 space-y-4">
          <h3 className="text-sm font-medium">Email Address</h3>
          <p className="text-sm text-[#5F6064]">
            Your billing information & proposal updates will be sent to this
            email address
          </p>
        </div>
        <div className="col-start-5 col-span-2 space-y-4">
          <h3 className="text-sm font-medium">Email Address</h3>
          <EmailSheet email={user.user?.email ?? ''} />
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-6">
        <div className="col-start-1 col-span-2 space-y-4">
          <h3 className="text-sm font-medium">Phone Number</h3>
          <p className="text-sm text-[#5F6064]">
            Your billing information & proposal updates will be sent to this
            email address
          </p>
        </div>
        <div className="col-start-5 col-span-2 space-y-4">
          <h3 className="text-sm font-medium">Phone Number</h3>
          <PhoneSheet phone={user.profile.phone ?? ''} />
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-6">
        <div className="col-start-1 col-span-2 space-y-4">
          <h3 className="text-sm font-medium">Password</h3>
          <p className="text-sm text-[#5F6064]">
            Reset your password to keep your account secure and private
          </p>
        </div>
        <div className="col-start-5 col-span-2 space-y-4">
          <h3 className="text-sm font-medium">Current Password</h3>
          <PasswordSheet />
        </div>
      </div>
      <Separator />
    </div>
  );
}
