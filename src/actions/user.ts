'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

const updateUserEmailSchema = z.object({
  email: z.string().email('Invalid email address'),
});

interface UpdateUserEmailState {
  errors?: {
    email?: string[];
  };
  success?: boolean;
}

export async function updateUserEmail(
  state: UpdateUserEmailState,
  formData: FormData,
): Promise<UpdateUserEmailState> {
  const supabase = await createClient();

  const result = updateUserEmailSchema.safeParse({
    email: formData.get('email'),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { data, error } = await supabase.auth.updateUser({
    email: result.data.email,
  });

  if (error) {
    return {
      errors: {
        email: [error.message],
      },
    };
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      email: result.data.email,
    })
    .eq('id', data.user?.id ?? '');

  if (profileError) {
    return {
      errors: {
        email: [profileError.message],
      },
    };
  }

  revalidatePath('/[organization]/settings/account', 'layout');
  return { success: true };
}

const updatePasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(255, 'Password must be at most 255 characters'),
  confirmPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(255, 'Password must be at most 255 characters'),
});

interface UpdatePasswordState {
  errors?: {
    password?: string[];
    confirmPassword?: string[];
  };
  success?: boolean;
}

export async function updatePassword(
  state: UpdatePasswordState,
  formData: FormData,
): Promise<UpdatePasswordState> {
  const supabase = await createClient();

  const result = updatePasswordSchema.safeParse({
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  if (result.data.password !== result.data.confirmPassword) {
    return {
      errors: {
        confirmPassword: ['Passwords do not match'],
      },
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: result.data.password,
  });

  if (error) {
    return {
      errors: {
        password: [error.message],
      },
    };
  }

  revalidatePath('/[organization]/settings/account', 'layout');
  return { success: true };
}

const updatePhoneSchema = z.object({
  phone: z.string().min(6, 'Phone number must be at least 6 characters'),
});

interface UpdatePhoneState {
  errors?: {
    phone?: string[];
  };
  success?: boolean;
}

export async function updatePhone(
  state: UpdatePhoneState,
  formData: FormData,
): Promise<UpdatePhoneState> {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  const result = updatePhoneSchema.safeParse({
    phone: formData.get('phone'),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      phone: result.data.phone,
    })
    .eq('id', user?.user?.id ?? '');

  if (error) {
    return {
      errors: {
        phone: [error.message],
      },
    };
  }

  revalidatePath('/[organization]/settings/account', 'layout');
  return { success: true };
}
