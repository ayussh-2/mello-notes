import { Trash2 } from 'lucide-react-native';
import React from 'react';
import { View, Text } from 'react-native';
import { Button } from '../ui/Button';

const BottomBar = ({
  selectedNotes,
  confirmDeleteNotes,
}: {
  selectedNotes: string[];
  confirmDeleteNotes: () => void;
}) => {
  return (
    <View className="absolute bottom-0 left-0 right-0 flex-row items-center justify-between bg-[##fefdf8] p-4">
      <Text className="font-nunito-regular text-text-primary">
        {selectedNotes.length} {selectedNotes.length === 1 ? 'note' : 'notes'} selected
      </Text>
      <Button onPress={confirmDeleteNotes} className="w-auto p-4">
        <Trash2 size={18} color="white" />
      </Button>
    </View>
  );
};

export default BottomBar;
