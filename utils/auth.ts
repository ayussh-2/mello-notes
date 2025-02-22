import { supabase } from './supabase';
import { handleAsync } from './asyncHandler';

interface SignUpData {
  email: string;
  password: string;
  fullName: string;
}

export const signUp = ({ email, password, fullName }: SignUpData) =>
  handleAsync(async () => {
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    console.log(authData);
    if (signUpError) throw signUpError;

    return authData;
  }, 'Signed up successfully!');

export const signIn = (email: string, password: string) =>
  handleAsync(async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return data;
  }, 'Logged in successfully!');

export const signOut = () =>
  handleAsync(async () => {
    const { error } = await supabase.auth.signOut();
    return { success: true };
  }, 'Logged out successfully!');
