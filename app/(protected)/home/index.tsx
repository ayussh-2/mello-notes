import React from 'react';
import { View, Text } from 'react-native';
import { Container } from '~/components/Container';
import { Button } from '~/components/ui/Button';
import { useSession } from '~/lib/ctx';

export default function Home() {
  const { signOut } = useSession();

  return (
    <Container>
      <View>
        <Text>Start Creating Notes</Text>
        <Button onPress={signOut}>Logout</Button>
      </View>
    </Container>
  );
}
