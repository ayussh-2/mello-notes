import { Trash2 } from 'lucide-react-native';
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

const BottomBar = ({
  selectedNotes,
  confirmDeleteNotes,
}: {
  selectedNotes: string[];
  confirmDeleteNotes: () => void;
}) => {
  return (
    <View className="absolute bottom-0 left-0 right-0 flex-row items-center justify-between border-t border-gray-200 bg-white p-4">
      <Text className="font-nunito-medium text-text-primary">
        {selectedNotes.length} {selectedNotes.length === 1 ? 'note' : 'notes'} selected
      </Text>
      <TouchableOpacity
        onPress={confirmDeleteNotes}
        className="h-12 w-12 items-center justify-center rounded-full bg-red-500">
        <Trash2 size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default BottomBar;
