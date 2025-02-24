import { Ionicons } from '@expo/vector-icons';
import { View, TouchableOpacity, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Link } from 'expo-router';

interface NavbarProps {
  children: string;
}

export default function Navbar({ children }: NavbarProps) {
  const navigation = useNavigation();
  const route = useRoute();

  const isHomeScreen = route.name === 'home/index';
  return (
    <View className="w-full px-5 pt-5">
      <View className="mb-5 flex-row items-center justify-between">
        {isHomeScreen ? (
          <>
            <TouchableOpacity className="p-2">
              <Ionicons name="menu" size={24} color="#333" />
            </TouchableOpacity>
            <Text className="font-nunito-extra-bold text-xl font-semibold text-text-primary">
              {children}
            </Text>
            <TouchableOpacity className="p-2">
              <Ionicons name="search" size={24} color="#333" />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Link href={'/home'} asChild>
              <TouchableOpacity className="p-2" onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#333" />
              </TouchableOpacity>
            </Link>
            <Text className="flex-1 text-center font-nunito-extra-bold text-xl font-semibold text-text-primary">
              {children}
            </Text>
            <View style={{ width: 32 }} />
          </>
        )}
      </View>
    </View>
  );
}
