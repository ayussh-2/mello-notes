import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
export default function CreateButton() {
  return (
    <Link href={'/create'} asChild>
      <TouchableOpacity className="absolute bottom-5 right-5 h-14 w-14 items-center justify-center rounded-full bg-primary-500 shadow-lg">
        <Ionicons name="add" size={30} color="#FFF" />
      </TouchableOpacity>
    </Link>
  );
}
