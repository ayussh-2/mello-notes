import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { LogOut, Trash2, Sparkles } from 'lucide-react-native';
import { Container } from '~/components/Container';
import MenuOption from '~/components/settings/MenuOption';
import { router } from 'expo-router';
import GeminiModal from '~/components/settings/GeminiModal';

const Settings = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [apiKey, setApiKey] = useState('');

  function goToTrash() {
    router.push('/trash');
  }

  function openModal() {
    setModalVisible(true);
  }

  function closeModal() {
    setModalVisible(false);
  }

  function saveApiKey() {
    console.log('API Key Saved:', apiKey);
    closeModal();
  }

  return (
    <Container>
      <View className="w-full flex-1 p-6">
        <View className="mb-6 items-center">
          <Text className="mt-5 font-titan text-4xl text-gray-800">Mello Notes</Text>
        </View>

        <View className="mb-4 w-full">
          <MenuOption Icon={Sparkles} label="Gemini Api Key" handlePress={openModal} />
          <MenuOption Icon={Trash2} label="Trash Bin" handlePress={goToTrash} />
          <MenuOption Icon={LogOut} label="Log Out" />
        </View>

        <View className="mb-4 mt-auto">
          <Text className="text-center font-nunito-extra-bold text-sm text-gray-500">
            Made with ❤️ by Ayush
          </Text>
        </View>
      </View>

      <GeminiModal
        isModalVisible={isModalVisible}
        closeModal={closeModal}
        apiKey={apiKey}
        setApiKey={setApiKey}
        saveApiKey={saveApiKey}
      />
    </Container>
  );
};

export default Settings;
