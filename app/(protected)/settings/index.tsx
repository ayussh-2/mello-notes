import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LogOut, Trash2, ChevronRight, Sparkles } from 'lucide-react-native';
import { Container } from '~/components/Container';

const Settings = () => {
  return (
    <Container>
      <View className="w-full flex-1 p-6">
        <View className="mb-6 items-center">
          <Text className="mt-5 font-titan text-4xl text-gray-800">Mello Notes</Text>
        </View>

        <View className="mb-4 w-full">
          <MenuOption Icon={Sparkles} label="Gemini Api Key" />
          <MenuOption Icon={Trash2} label="Trash Bin" />
          <MenuOption Icon={LogOut} label="Log Out" />
        </View>

        <View className="mb-4 mt-auto">
          <Text className="text-center font-nunito-extra-bold text-sm text-gray-500">
            Made with ❤️ by Ayush
          </Text>
        </View>
      </View>
    </Container>
  );
};

const MenuOption = ({ Icon, label }: { Icon: any; label: string }) => {
  return (
    <TouchableOpacity className={`flex-row items-center p-4 `}>
      <View className="mr-3 h-12 w-12 items-center justify-center rounded-xl bg-[#FFFDFA]">
        <Icon size={20} color="#DC2626" />
      </View>
      <Text className="flex-1 font-nunito-regular text-lg text-[#595555]">{label}</Text>
      <ChevronRight size={16} color="#9CA3AF" />
    </TouchableOpacity>
  );
};

export default Settings;
