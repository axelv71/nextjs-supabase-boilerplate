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

type UploadLogoProps = {
  organizationId: string;
  imageUrl: string | null;
};

export const UploadLogo = ({ organizationId, imageUrl }: UploadLogoProps) => {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    // Check if file is selected
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      toast.loading('Uploading logo...', {
        id: 'upload-logo',
      });

      // Check if file size is too large
      if (file.size > maxSize) {
        return toast.error('File size is too large. Max size is 5MB.', {
          id: 'upload-logo',
        });
      }

      const ext = file.name.split('.').pop();
      const filename = `${organizationId}.${ext}`;

      // Upload file to storage
      const { error: uploadingError } = await supabase.storage
        .from('organizations_logo')
        .upload(filename, file, {
          upsert: true,
        });
      if (uploadingError) {
        return toast.error('Error uploading logo. Please try again.', {
          id: 'upload-logo',
        });
      }

      // Update organization logo in database
      const { error: updateError } = await supabase
        .from('organizations')
        .update({
          image_url: filename,
        })
        .eq('id', organizationId);
      if (updateError) {
        return toast.error('Error updating logo. Please try again.', {
          id: 'upload-logo',
        });
      }

      router.refresh();
      return toast.success('Logo uploaded successfully.', {
        id: 'upload-logo',
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
            alt="Organization Logo"
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
        <h3 className="text-sm font-medium">Company Logo</h3>
        <p className="text-sm text-[#5F6064]">
          Logos are displayed in the Client Previews and in the App. Max
          dimensions: 1000px by 1000px
        </p>
        <Button variant="outline" size="sm" onClick={handleLoadFile}>
          {imageUrl ? (
            <Fragment>
              <RefreshCcw05 className="size-4" />
              Change Logo
            </Fragment>
          ) : (
            <Fragment>
              <Download04 className="size-4" />
              Upload Logo
            </Fragment>
          )}
        </Button>
      </div>
    </div>
  );
};
