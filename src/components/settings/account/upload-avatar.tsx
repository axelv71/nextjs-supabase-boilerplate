'use client';

import { Download04, DownloadCloud01, RefreshCcw05 } from '@/assets/icons';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChangeEvent, Fragment, Suspense, useRef } from 'react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const maxSize = 5242880; // 5MB

type UploadAvatarProps = {
  userId: string;
  imageUrl: string | null;
};

export const UploadAvatar = ({ imageUrl, userId }: UploadAvatarProps) => {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    // Check if file is selected
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      toast.loading('Uploading avatar...', {
        id: 'upload-avatar',
      });

      // Check if file size is too large
      if (file.size > maxSize) {
        return toast.error('File size is too large. Max size is 5MB.', {
          id: 'upload-avatar',
        });
      }

      const ext = file.name.split('.').pop();
      const filename = `${userId}.${ext}`;

      // Upload file to storage
      const { error: uploadingError } = await supabase.storage
        .from('avatars')
        .upload(filename, file, {
          upsert: true,
        });
      if (uploadingError) {
        return toast.error('Error uploading avatar. Please try again.', {
          id: 'upload-avatar',
        });
      }

      // Update avatar in database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          picture_url: filename,
        })
        .eq('id', userId);
      if (updateError) {
        return toast.error('Error updating avatar. Please try again.', {
          id: 'upload-avatar',
        });
      }

      router.refresh();
      return toast.success('Avatar uploaded successfully.', {
        id: 'upload-avatar',
      });
    }
  };

  const handleLoadFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-row items-center gap-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      {imageUrl ? (
        <Suspense
          fallback={
            <div className="min-w-48 w-48 h-48 bg-[#EDEDED] rounded-lg animate-pulse" />
          }
        >
          <Image
            src={imageUrl}
            alt="Avatar"
            width={500}
            height={500}
            className="min-w-48 w-48 h-48 rounded-lg object-cover"
          />
        </Suspense>
      ) : (
        <div
          className={cn(
            'min-w-48 w-48 h-48  border-2 rounded-lg border-dashed border-[#EDEDED] flex flex-col justify-center items-center space-y-1 text-[#7F8082]',
            'hover:border-[#1F1E24] hover:text-[#1F1E24] transition duration-200 ease-in-out cursor-pointer',
          )}
          onClick={handleLoadFile}
        >
          <DownloadCloud01 className="size-6" />
          <span className="text-xs">Drag & Drop or Upload</span>
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-sm font-medium">Avatar</h3>
        <p className="text-sm text-[#5F6064]">
          Upload a new avatar for your account.
          Max dimensions: 1000px by 1000px
        </p>
        <Button variant="outline" size="sm" onClick={handleLoadFile}>
          {imageUrl ? (
            <Fragment>
              <RefreshCcw05 className="size-4" />
              Change Avatar
            </Fragment>
          ) : (
            <Fragment>
              <Download04 className="size-4" />
              Upload Avatar
            </Fragment>
          )}
        </Button>
      </div>
    </div>
  );
};
