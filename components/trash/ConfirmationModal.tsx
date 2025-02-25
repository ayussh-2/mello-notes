import React from 'react';
import { Modal, View, Text } from 'react-native';
import { Button } from '../ui/Button';

interface ConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmationModal({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}: ConfirmationModalProps) {
  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="w-4/5 rounded-lg bg-white p-6">
          <Text className="mb-4 font-nunito-bold text-lg">{title}</Text>
          <Text className="mb-6 font-nunito-regular">{message}</Text>
          <View className="flex-row justify-end">
            <Button onPress={onClose} className="mr-4 w-auto" variant="secondary">
              {cancelText}
            </Button>
            <Button onPress={onConfirm} className={`w-auto bg-red-500 `}>
              {confirmText}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
