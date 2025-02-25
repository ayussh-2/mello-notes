import React from 'react';
import { Modal, View, TouchableOpacity, Text } from 'react-native';

export default function ConfirmModal({
  confirmDelete,
  setConfirmDelete,
  selectedNotes,
  executeDelete,
}: {
  confirmDelete: boolean;
  setConfirmDelete: (value: boolean) => void;
  selectedNotes: string[];
  executeDelete: () => void;
}) {
  return (
    <Modal
      visible={confirmDelete}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setConfirmDelete(false)}>
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="w-4/5 rounded-lg bg-white p-6">
          <Text className="mb-4 font-nunito-bold text-lg">Move to Bin?</Text>
          <Text className="mb-6 font-nunito-regular">
            {selectedNotes.length === 1
              ? 'Are you sure you want to move this note to bin?'
              : `Are you sure you want to move these ${selectedNotes.length} notes to bin?`}
          </Text>
          <View className="flex-row justify-end">
            <TouchableOpacity onPress={() => setConfirmDelete(false)} className="mr-4 p-2">
              <Text className="font-nunito-bold text-gray-600">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={executeDelete} className="p-2">
              <Text className="font-nunito-bold text-red-500">Move to Bin</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
