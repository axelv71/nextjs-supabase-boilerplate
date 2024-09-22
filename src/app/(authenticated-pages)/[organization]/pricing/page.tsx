import { getOrganizationBySlug } from '@/utils/organization';
import { createClient } from '@/lib/supabase/server';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CreateCheckoutButton } from '@/components/pricing/create-checkout-button';

type Props = {
  params: {
    organization: string;
  };
};

export default async function Page({ params }: Props) {
  const supabase = createClient();
  await getOrganizationBySlug(params.organization);
  const { data: products, error } = await supabase
    .from('products')
    .select('*, prices(*)');

  if (error) {
    throw new Error('Error fetching products');
  }

  return (
    <div className="p-8 h-screen flex w-full justify-center items-center">
      <div className="space-y-4">
        <h1 className="text-center text-3xl font-bold">Pricing</h1>
        <p className="text-center">
          Get started with our free plan or upgrade to a premium plan for more
          features.
        </p>
        <div className="max-w-2xl w-full">
          <div className="flex flex-row w-full space-x-2">
            {products.map((product) => (
              <Card key={product.id} className="w-full">
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-x-1">
                    <span className="text-4xl font-bold">
                      {product.prices[0].unit_amount / 100}
                      {product.prices[0].currency.toUpperCase()}
                    </span>
                    <span className="text-sm opacity-75">
                      /{product.prices[0].interval?.toUpperCase()}
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <CreateCheckoutButton
                    priceId={product.prices[0].id}
                    organizationSlug={params.organization}
                  />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
