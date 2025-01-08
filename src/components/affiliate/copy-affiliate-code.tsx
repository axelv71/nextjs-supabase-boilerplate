'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type CopyAffiliateCodeProps = {
  affiliateCode: string;
};

export function CopyAffiliateCode({ affiliateCode }: CopyAffiliateCodeProps) {
  const handleCopy = () => {
    toast.promise(navigator.clipboard.writeText(affiliateCode), {
      loading: 'Copying...',
      success: 'Copied!',
      error: 'Failed to copy',
    });
  };

  return (
    <div className="flex space-x-2">
      <Input value={affiliateCode} disabled />
      <Button onClick={handleCopy}>Copy</Button>
    </div>
  );
}
