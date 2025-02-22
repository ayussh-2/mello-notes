import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { Link, router } from 'expo-router';
import { Container } from '~/components/Container';
import { Input } from '~/components/form/Input';
import { Button } from '~/components/ui/Button';
import { FormContainer } from '~/components/form/FormContainer';
import { signUp } from '~/utils/auth';
import { userStorage } from '~/utils/userStorage';

type SignUpData = {
  fullName: string;
  email: string;
  password: string;
};

export default function SignUp() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpData>({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: SignUpData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await signUp(data);
      if (result && result.user) {
        const { user } = result;
        await userStorage.saveUser({
          email: user.email!,
          fullName: user.user_metadata.fullName,
          id: user.id,
        });
        router.navigate('/home');
      } else {
        throw new Error('Sign up failed');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <FormContainer>
        <View className="w-full flex-1 items-center">
          <Text className="mt-20 text-center font-titan text-4xl text-text-primary">
            Mello Notes
          </Text>

          <Text className="mt-20 font-nunito-extra-bold text-3xl text-text-primary">
            Create a free account
          </Text>

          <Text className="mb-10 mt-5 w-96 text-center font-nunito-bold text-text-secondary">
            Join Mello Notes for free. Create and share unlimited notes with your friends.
          </Text>

          {error && <Text className="mb-4 text-center text-red-500">{error}</Text>}

          <Input
            control={control}
            name="fullName"
            label="Full Name"
            rules={{
              required: 'Full name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters',
              },
            }}
            placeholder="Ayush"
          />
          <Input
            control={control}
            name="email"
            label="Email"
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: 'Enter a valid email',
              },
            }}
            placeholder="ayush@email.com"
          />
          <Input
            control={control}
            name="password"
            label="Password"
            rules={{
              required: 'Password is required',
              minLength: {
                value: 5,
                message: 'Password must be at least 5 characters',
              },
            }}
            placeholder="********"
            secureTextEntry
          />

          <View className="mt-10 w-full flex-1 gap-5">
            <Button onPress={handleSubmit(onSubmit)} isLoading={loading}>
              Create Account
            </Button>
            {/* <Button>Continue With Google</Button> */}

            <Button variant="link">
              <Link href="/login">Already have an account?</Link>
            </Button>
          </View>
        </View>
      </FormContainer>
    </Container>
  );
}
