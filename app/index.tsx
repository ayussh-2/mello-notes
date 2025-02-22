import React from 'react';
import { View, Text } from 'react-native';
import { Container } from '~/components/Container';

export default function Root() {
  return (
    <Container>
      <View className="flex-1 items-center justify-center">
        <Text className="font-titan text-4xl">Mello Notes</Text>
      </View>
    </Container>
  );
}
