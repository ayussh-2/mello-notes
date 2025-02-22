import { Container } from '~/components/Container';
import { Text, TouchableOpacity, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { Input } from '~/components/form/Input';
import { Button } from '~/components/ui/Button';

export default function Auth() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
  });

  return (
    <Container>
      <View className="w-full flex-1 items-center ">
        <Text className="text-text-primary font-titan mt-20 text-center text-4xl">Mello Notes</Text>

        <Text className="text-text-primary font-nunito-extra-bold mt-20 text-3xl">
          Create a free account
        </Text>

        <Text className="text-text-secondary font-nunito-bold mb-10 mt-5 w-96 text-center">
          Join Notely for free. Create and share unlimited notes with your friends.
        </Text>

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
          placeholder="Enter your full name"
        />
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
          placeholder="you@domain.com"
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

        <View className="mt-2 w-full flex-1">
          <Button onPress={() => handleSubmit}>Create Account</Button>
          <Button onPress={() => console.log('pressed')} variant="link" className=" mt-4">
            Already have an account?
          </Button>
        </View>
      </View>
    </Container>
  );
}
