import { Ionicons } from '@expo/vector-icons';
import { View, TouchableOpacity, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Link } from 'expo-router';
import React from 'react';
import { Settings, User } from 'lucide-react-native';

interface NavbarProps {
  children?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export default function Navbar({ children, rightElement }: NavbarProps) {
  const navigation = useNavigation();
  const route = useRoute();

  const isHomeScreen = route.name === 'home/index';

  return (
    <View className="w-full px-5 pt-5">
      <View className="mb-5 flex-row items-center justify-between">
        {isHomeScreen ? (
          <>
            <Link href={'/settings'} asChild>
              <TouchableOpacity className="p-2">
                <Settings size={24} color="#333" />
              </TouchableOpacity>
            </Link>

            {children}

            {rightElement ? (
              rightElement
            ) : (
              <TouchableOpacity className="p-2">
                <Ionicons name="search" size={24} color="#333" />
              </TouchableOpacity>
            )}
          </>
        ) : (
          <>
            <Link href={'/home'} asChild>
              <TouchableOpacity className="p-2" onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#333" />
              </TouchableOpacity>
            </Link>

            {typeof children === 'string' ? (
              <Text className="flex-1 text-center font-nunito-extra-bold text-xl font-semibold text-text-primary">
                {children}
              </Text>
            ) : (
              <View className="flex-1">{children}</View>
            )}

            {rightElement ? rightElement : <View style={{ width: 32 }} />}
          </>
        )}
      </View>
    </View>
  );
}
