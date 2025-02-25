import React from 'react';
import { Modal, View, TouchableOpacity, Text } from 'react-native';

interface ConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
}

export default function ConfirmationModal({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'text-red-500',
}: ConfirmationModalProps) {
  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="w-4/5 rounded-lg bg-white p-6">
          <Text className="mb-4 font-nunito-bold text-lg">{title}</Text>
          <Text className="mb-6 font-nunito-regular">{message}</Text>
          <View className="flex-row justify-end">
            <TouchableOpacity onPress={onClose} className="mr-4 p-2">
              <Text className="font-nunito-bold text-gray-600">{cancelText}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm} className="p-2">
              <Text className={`font-nunito-bold ${confirmColor}`}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
