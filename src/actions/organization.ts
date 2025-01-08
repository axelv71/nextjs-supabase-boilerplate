'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { getOrganizationBySlug } from '@/services/organization';
import { redirect } from 'next/navigation';

const updateOrganizationNameSchema = z.object({
  name: z.string().min(4, 'Name number must be at least 6 characters'),
  organization: z
    .string()
    .min(4, 'Organization number must be at least 6 characters'),
});

interface UpdateOrganizationNameState {
  errors?: {
    name?: string[];
    organization?: string[];
    _form?: string[];
  };
  success?: boolean;
}

export async function updateOrganizationName(
  state: UpdateOrganizationNameState,
  formData: FormData,
): Promise<UpdateOrganizationNameState> {
  const supabase = await createClient();

  const result = updateOrganizationNameSchema.safeParse({
    name: formData.get('name'),
    organization: formData.get('organization'),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { organization } = await getOrganizationBySlug(
    result.data.organization,
  );

  const { data, error } = await supabase
    .from('organizations')
    .update({
      name: result.data.name,
    })
    .eq('id', organization.id)
    .select('slug')
    .single();

  if (error) {
    return {
      errors: {
        _form: [error.message],
      },
    };
  }

  revalidatePath('/[organization]/settings', 'layout');
  return redirect(`/${data.slug}/settings`);
}
