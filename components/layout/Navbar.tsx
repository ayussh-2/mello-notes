import { Ionicons } from '@expo/vector-icons';
import { View, TouchableOpacity, Text } from 'react-native';

interface NavbarProps {
  children: string;
}

export default function Navbar({ children }: NavbarProps) {
  return (
    <View className="w-full px-5 pt-5">
      <View className="mb-5 flex-row items-center justify-between">
        <TouchableOpacity className="p-2">
          <Ionicons name="menu" size={24} color="#333" />
        </TouchableOpacity>
        <Text className="font-nunito-extra-bold text-xl font-semibold text-text-primary">
          {children}
        </Text>
        <TouchableOpacity className="p-2">
          <Ionicons name="search" size={24} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
