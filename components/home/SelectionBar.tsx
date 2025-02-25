import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Button } from '../ui/Button';

interface SelectionBarProps {
  selectedNotes: string[];
  cancelSelection: () => void;
}

export default function SelectionBar({ selectedNotes, cancelSelection }: SelectionBarProps) {
  return (
    <View className="flex-row items-center">
      <Button onPress={cancelSelection} className="mr-4 w-auto p-2" variant="secondary">
        Cancel
      </Button>
      <Text className="font-nunito-bold">{selectedNotes.length} Selected</Text>
    </View>
  );
}
