import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Grid01, MagicWand02 } from '@/assets/icons';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { CopyAffiliateCode } from '@/components/affiliate/copy-affiliate-code';
import { CopyAffiliateLink } from '@/components/affiliate/copy-affiliate-link';

export default async function Page() {
  const supabase = await createClient();
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) {
    notFound();
  }

  const { data: affiliateCode, error: affiliateCodeError } = await supabase
    .from('promotional_codes')
    .select('*')
    .eq('referer_id', user.user?.id ?? '')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (affiliateCodeError) {
    throw affiliateCodeError;
  }

  return (
    <div className="p-8 space-y-10">
      <div className="flex justify-between items-end">
        <div className="space-y-4">
          <h1 className="font-britti text-2xl">Affiliate Program</h1>
          <p className="text-[#5F6064]">
            We’re here to guide you step-by-step to close as many deals as
            possible using ProPal
          </p>
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-6">
        <div className="col-start-1 col-span-2 space-y-4">
          <h3 className="text-sm font-medium">Affiliate Link</h3>
          <p className="text-sm text-[#5F6064]">
            Share this link with your network to earn rewards. It will redirect
            them to our website with your affiliate code.
          </p>
        </div>
        <div className="col-start-5 col-span-2 space-x-2 flex items-end justify-end">
          <CopyAffiliateLink affiliateCode={affiliateCode.code ?? ''} />
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-6">
        <div className="col-start-1 col-span-2 space-y-4">
          <h3 className="text-sm font-medium">Affiliate Code</h3>
          <p className="text-sm text-[#5F6064]">
            Share this code with your network to earn rewards.
          </p>
        </div>
        <div className="col-start-5 col-span-2 space-x-2 flex items-end justify-end">
          <CopyAffiliateCode affiliateCode={affiliateCode.code ?? ''} />
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-6">
        <div className="col-start-1 col-span-2 space-y-4">
          <h3 className="text-sm font-medium">Marketing Resources</h3>
          <p className="text-sm text-[#5F6064]">
            Your billing information & proposal updates will be sent to this
            email address
          </p>
        </div>
        <div className="col-start-5 col-span-2 space-x-2 flex items-end justify-end">
          <Button variant="outline" size="sm">
            <Grid01 className="size-4 fill-[#EAEAEA]" />
            Content Ideas
          </Button>
          <Button variant="outline" size="sm">
            <MagicWand02 className="size-4 fill-[#EAEAEA]" />
            Brand Assets
          </Button>
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-6 gap-y-5">
        <div className="col-start-1 col-span-2 space-y-4">
          <h3 className="text-sm font-medium">Frequently Asked Questions</h3>
          <p className="text-sm text-[#5F6064]">
            Your billing information & proposal updates will be sent to this
            email address
          </p>
        </div>
        <div className="col-start-5 col-span-2 flex items-end justify-end">
          <Button variant="outline" size="sm">
            Contact us
          </Button>
        </div>

        <Accordion type="single" collapsible className="col-span-6 space-y-3">
          <AccordionItem value="item-1">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Is it styled?</AccordionTrigger>
            <AccordionContent>
              Yes. It comes with default styles that matches the other
              components&apos; aesthetic.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Is it animated?</AccordionTrigger>
            <AccordionContent>
              {
                "Yes. It's animated by default, but you can disable it if you prefer. "
              }
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
