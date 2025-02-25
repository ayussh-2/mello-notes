import { Container } from '~/components/Container';
import { Text, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { Input } from '~/components/form/Input';
import { Button } from '~/components/ui/Button';
import { FormContainer } from '~/components/form/FormContainer';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { signIn } from '~/utils/auth';
import { useSession } from '~/lib/ctx';

type LoginData = {
  email: string;
  password: string;
};

export default function Login() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const { refreshSession } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: LoginData) => {
    setLoading(true);
    setError(null);
    try {
      const authenticated = await signIn(data.email, data.password);
      refreshSession();
      if (authenticated) router.push('/home');
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

 

  return (
    <Container>
      <FormContainer>
        <View className="w-full flex-1 items-center ">
          <Text className="mt-20 text-center font-titan text-4xl text-text-primary">
            Mello Notes
          </Text>

          <Text className="mt-20 font-nunito-extra-bold text-3xl text-text-primary">
            Login to your account
          </Text>

          <Text className="mb-10 mt-5 w-96 text-center font-nunito-bold text-text-secondary">
            Get access to your notes and create new ones.
          </Text>

          {error && <Text className="mb-4 text-center text-red-500">{error}</Text>}

          <Input
            control={control}
            name="email"
            label="Email"
            rules={{
              required: 'Email is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters',
              },
            }}
            placeholder="ayush@email.com"
          />
          <Input
            control={control}
            name="password"
            label="Password"
            secureTextEntry
            rules={{
              required: 'Password is required',
              minLength: {
                value: 5,
                message: 'Password must be at least 5 characters',
              },
            }}
            placeholder="#######"
          />

          <View className="mt-10 w-full flex-1 gap-5">
            <Button onPress={handleSubmit(onSubmit)} isLoading={loading}>
              Login
            </Button>
            {/* <Button onPress={() => handleSubmit}>Continue With Google</Button> */}
            <Button variant="link">
              <Link href="/signup">Dont have an account? Sign up</Link>
            </Button>
          </View>
        </View>
      </FormContainer>
    </Container>
  );
}
