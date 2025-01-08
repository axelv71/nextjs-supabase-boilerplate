'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { retrieveUserDefaultOrganization } from '@/services/organization';
import { Tables } from '@/types/database.types';
import { config } from '@/config';
import { getOnboardingIfCompleted } from '@/services/onboarding';
import { loops } from '@/lib/loops';
import { linkAffiliate } from '@/services/affiliate';
import { cookies } from 'next/headers';

const signUpSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(255, 'Name must be at most 255 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(255, 'Password must be at most 255 characters'),
  referral: z.string().optional(),
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
  const supabase = await createClient();
  const cookieStore = await cookies();

  const result = signUpSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    referral: formData.get('referral'),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { data: user, error } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
    options: {
      data: {
        name: result.data.name,
        full_name: result.data.name,
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

  // Register the user contact in Loops
  try {
    await loops.createContact(result.data.email, {
      userId: user.user?.id ?? '',
      email: result.data.email,
      firstName: result.data.name,
      source: 'Application',
      planName: 'free',
      userGroup: 'User',
    });
  } catch (error) {
    console.error('Error creating user in Loops', error);
  }

  // Link the user to the referral
  if (result.data.referral) {
    await linkAffiliate(result.data.referral, user.user?.id ?? '', 'sign_up');
    cookieStore.delete('referral');
  }

  revalidatePath('/', 'layout');
  redirect('/login?email=' + result.data.email);
}

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string(),
  next: z.string().optional(),
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
  const supabase = await createClient();

  const result = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    next: formData.get('next'),
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

  if (result.data.next) {
    return redirect(result.data.next);
  }

  const organization = await retrieveUserDefaultOrganization(supabase);
  const onboardingIsCompleted = await getOnboardingIfCompleted(supabase);

  revalidatePath('/', 'layout');
  return redirect(
    `/${(organization.organizations as unknown as Tables<'organizations'>).slug}${!onboardingIsCompleted ? '/onboarding' : ''}`,
  );
}

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

interface ForgotPasswordFormState {
  errors: {
    email?: string[];
    _form?: string[];
  };
}

export async function forgotPassword(
  formState: ResetPasswordFormState,
  formData: FormData,
): Promise<ForgotPasswordFormState> {
  const supabase = await createClient();

  const result = forgotPasswordSchema.safeParse({
    email: formData.get('email'),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(
    result.data.email,
    {
      redirectTo: config.env.site_url,
    },
  );
  if (error) {
    return {
      errors: {
        _form: [error.message],
      },
    };
  }

  revalidatePath('/login', 'layout');
  redirect('/reset-password?email=' + result.data.email);
}

const resetPasswordSchema = z.object({
  email: z.string().email(),
  code: z.string().min(6, 'Code must be at least 6 characters'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(255, 'Password must be at most 255 characters'),
  confirmPassword: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(255, 'Password must be at most 255 characters'),
});

interface ResetPasswordFormState {
  errors: {
    email?: string[];
    code?: string[];
    password?: string[];
    confirmPassword?: string[];
    _form?: string[];
  };
}

export async function resetPassword(
  formState: ResetPasswordFormState,
  formData: FormData,
): Promise<ResetPasswordFormState> {
  const supabase = await createClient();

  const result = resetPasswordSchema.safeParse({
    email: formData.get('email'),
    code: formData.get('code'),
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

  // Verify the code
  const { error: codeError } = await supabase.auth.verifyOtp({
    email: result.data.email,
    token: result.data.code,
    type: 'email',
  });

  if (codeError) {
    return {
      errors: {
        _form: [codeError.message],
      },
    };
  }

  // Reset the password
  const { error: passwordError } = await supabase.auth.updateUser({
    password: result.data.password,
  });

  if (passwordError) {
    return {
      errors: {
        _form: [passwordError.message],
      },
    };
  }

  const organization = await retrieveUserDefaultOrganization(supabase);
  const onboardingIsCompleted = await getOnboardingIfCompleted(supabase);

  revalidatePath('/', 'layout');
  redirect(
    `/${(organization.organizations as unknown as Tables<'organizations'>).slug}${!onboardingIsCompleted ? '/onboarding' : ''}`,
  );
}
