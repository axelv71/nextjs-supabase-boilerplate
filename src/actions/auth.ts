'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(255),
});

interface SignUpFormState {
  errors: {
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
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase.auth.signUp(result.data);
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

  revalidatePath('/', 'layout');
  redirect('/');
}
