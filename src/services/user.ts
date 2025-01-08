import { createClient } from '@/lib/supabase/server';

export async function getUserProfile() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw error;
  }

  const user = data.user;

  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .limit(1)
    .single();

  if (profileError) {
    throw profileError;
  }

  // Check if there is an avatar
  if (profileData.picture_url) {
    // Check if it's not a Google avatar
    if (!profileData.picture_url.includes('lh3.googleusercontent.com')) {
      const { data: signedUrlData, error: signedUrlError } =
        await supabase.storage
          .from('avatars')
          .createSignedUrl(profileData.picture_url, 3600, {
            transform: {
              width: 500,
              height: 500,
            },
          });

      if (signedUrlError) {
        console.error('Error creating signed URL:', signedUrlError);
      }

      profileData.picture_url = signedUrlData?.signedUrl || null;
    }
  }

  return {
    user,
    profile: profileData,
  };
}
