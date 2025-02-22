import { Container } from '~/components/Container';
import { Text, TouchableOpacity, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { Input } from '~/components/form/Input';
import { Button } from '~/components/ui/Button';
import { FormContainer } from '~/components/form/FormContainer';
import { Link } from 'expo-router';

export default function Auth() {
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

  return (
    <Container>
      <FormContainer>
        <View className="w-full flex-1 items-center ">
          <Text className="text-text-primary font-titan mt-20 text-center text-4xl">
            Mello Notes
          </Text>

          <Text className="text-text-primary font-nunito-extra-bold mt-20 text-3xl">
            Login to your account
          </Text>

          <Text className="text-text-secondary font-nunito-bold mb-10 mt-5 w-96 text-center">
            Get access to your notes and create new ones.
          </Text>

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
            <Button onPress={() => handleSubmit}>Create Account</Button>
            <Button onPress={() => handleSubmit}>Continue With Google</Button>
            <Button variant="link">
              <Link href="/">Dont have an account? Sign up</Link>
            </Button>
          </View>
        </View>
      </FormContainer>
    </Container>
  );
}
