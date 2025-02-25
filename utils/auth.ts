import { supabase } from './supabase';
import { handleAsync } from './asyncHandler';
import { userStorage } from './userStorage';

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
    const user = data?.user;
    if (!user) throw new Error('User not found');
    await userStorage.saveUser({
      email: user.email!,
      fullName: user.user_metadata.fullName,
      id: user.id,
    });
    if (error) throw error;
    return true;
  }, 'Logged in successfully!');

// export const resetPassword = (email: string) =>
//   handleAsync(async () => {
//     const { error } = await supabase.auth.resetPasswordForEmail(email);
//     if (error) throw error;
//     return { success: true };
//   }, 'Password reset email sent!');
