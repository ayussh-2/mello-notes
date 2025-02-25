import React from 'react';
import { Modal, Pressable, View, TextInput, Text } from 'react-native';
import { Button } from '../ui/Button';

interface GeminiModalProps {
  isModalVisible: boolean;
  closeModal: () => void;
  apiKey: string;
  setApiKey: (apiKey: string) => void;
  saveApiKey: () => void;
}

export default function GeminiModal({
  isModalVisible,
  closeModal,
  apiKey,
  setApiKey,
  saveApiKey,
}: GeminiModalProps) {
  return (
    <Modal
      visible={isModalVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={closeModal}>
      <Pressable className="flex-1 items-center justify-center bg-black/50" onPress={closeModal}>
        <View
          className="w-11/12 rounded-2xl bg-[#FFFDFA] p-6"
          onStartShouldSetResponder={() => true}>
          <Text className="mb-4 font-nunito-extra-bold text-2xl text-gray-800">
            Enter Gemini API Key
          </Text>
          <TextInput
            className="mb-4 w-full rounded-lg border border-gray-300 p-3 text-base text-gray-700"
            placeholder="Enter your API key"
            value={apiKey}
            onChangeText={setApiKey}
            secureTextEntry={true}
          />
          <View className="flex-row justify-end gap-2">
            <Button onPress={closeModal} className="w-auto" variant="secondary">
              Cancel
            </Button>
            <Button onPress={saveApiKey} className="w-auto">
              Save
            </Button>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}
