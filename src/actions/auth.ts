'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { retrieveUserDefaultOrganization } from '@/utils/organization';
import { Tables } from '@/types/database.types';

const signUpSchema = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email(),
  password: z.string().min(6).max(255),
});

interface SignUpFormState {
  errors: {
    name?: string[];
    email?: string[];
    password?: string[];
    _form?: string[];
  };
}

export async function signUp(
  formState: SignUpFormState,
  formData: FormData,
): Promise<SignUpFormState> {
  const supabase = createClient();

  const result = signUpSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
    options: {
      data: {
        name: result.data.name,
      },
    },
  });
  if (error) {
    return {
      errors: {
        _form: [error.message],
      },
    };
  }

  revalidatePath('/', 'layout');
  redirect('/login?email=' + result.data.email);
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

interface LoginFormState {
  errors: {
    email?: string[];
    password?: string[];
    _form?: string[];
  };
}

export async function login(
  formState: LoginFormState,
  formData: FormData,
): Promise<SignUpFormState> {
  const supabase = createClient();

  const result = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase.auth.signInWithPassword(result.data);
  if (error) {
    return {
      errors: {
        _form: [error.message],
      },
    };
  }

  const organization = await retrieveUserDefaultOrganization(supabase);

  revalidatePath('/', 'layout');
  redirect(
    `/${(organization.organizations as unknown as Tables<'organizations'>).slug}`,
  );
}
