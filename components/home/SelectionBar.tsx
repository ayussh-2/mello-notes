import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

interface SelectionBarProps {
  selectedNotes: string[];
  cancelSelection: () => void;
}

export default function SelectionBar({ selectedNotes, cancelSelection }: SelectionBarProps) {
  return (
    <View className="flex-row items-center">
      <TouchableOpacity onPress={cancelSelection} className="mr-4">
        <Text className="font-nunito-medium text-blue-500">Cancel</Text>
      </TouchableOpacity>
      <Text className="font-nunito-bold">{selectedNotes.length} Selected</Text>
    </View>
  );
}
