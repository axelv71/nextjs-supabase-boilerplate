'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type CopyAffiliateLinkProps = {
  affiliateCode: string;
};

export function CopyAffiliateLink({ affiliateCode }: CopyAffiliateLinkProps) {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/affiliate/?code=${affiliateCode}`;

  const handleCopy = () => {
    toast.promise(navigator.clipboard.writeText(url), {
      loading: 'Copying...',
      success: 'Copied!',
      error: 'Failed to copy',
    });
  };

  return (
    <div className="flex space-x-2">
      <Input value={url} disabled />
      <Button onClick={handleCopy}>Copy</Button>
    </div>
  );
}
