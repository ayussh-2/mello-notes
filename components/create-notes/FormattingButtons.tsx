import React from 'react';
import { View, TouchableOpacity } from 'react-native';
// @ts-ignore - no type definitions available
import Icon from 'react-native-vector-icons/Octicons';

interface FormattingButtonsProps {
  showFormatting: boolean;
  setShowFormatting: (show: boolean) => void;
  executeCommand: (command: string) => void;
}

export default function FormattingButtons({
  showFormatting,
  setShowFormatting,
  executeCommand,
}: FormattingButtonsProps) {
  return showFormatting ? (
    <View className="mb-2.5 w-auto rounded-xl bg-[#FFFDFA] p-2">
      <TouchableOpacity
        className="m-1 h-12 w-12 items-center justify-center rounded-lg bg-gray-100"
        onPress={() => executeCommand('bold')}>
        <Icon name="bold" size={20} color="#333" />
      </TouchableOpacity>

      <TouchableOpacity
        className="m-1 h-12 w-12 items-center justify-center rounded-lg bg-gray-100"
        onPress={() => executeCommand('italic')}>
        <Icon name="italic" size={20} color="#333" />
      </TouchableOpacity>

      <TouchableOpacity
        className="m-1 h-12 w-12 items-center justify-center rounded-lg bg-gray-100"
        onPress={() => executeCommand('insertUnorderedList')}>
        <Icon name="list-unordered" size={20} color="#333" />
      </TouchableOpacity>

      <TouchableOpacity
        className="m-1 h-12 w-12 items-center justify-center rounded-lg bg-gray-100"
        onPress={() => executeCommand('insertOrderedList')}>
        <Icon name="list-ordered" size={20} color="#333" />
      </TouchableOpacity>

      <View className="h-0 flex-1 items-center justify-center">
        <TouchableOpacity className=" rounded-lg" onPress={() => setShowFormatting(false)}>
          <Icon name="x" size={20} color="#f44336" />
        </TouchableOpacity>
      </View>
    </View>
  ) : (
    <TouchableOpacity
      className="h-14 w-14 items-center justify-center rounded-full bg-primary-500 shadow-md"
      onPress={() => setShowFormatting(true)}>
      <Icon name="pencil" size={24} color="#fff" />
    </TouchableOpacity>
  );
}
