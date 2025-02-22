import { Text } from 'react-native';
import { Redirect, Stack } from 'expo-router';
import { useSession } from '~/lib/ctx';

export default function AppLayout() {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (session) {
    return <Redirect href="/home" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
