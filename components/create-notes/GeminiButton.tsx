import React from 'react';
import { TouchableOpacity, ActivityIndicator, Image } from 'react-native';

interface GeminiButtonProps {
  isLoading: boolean;
  handleAutoComplete: () => void;
}

export default function GeminiButton({ isLoading, handleAutoComplete }: GeminiButtonProps) {
  return (
    <TouchableOpacity
      className="mb-2.5 h-14 w-14 items-center justify-center rounded-full bg-[#FFFDFA] shadow-md"
      onPress={handleAutoComplete}
      activeOpacity={0.7}
      disabled={isLoading}>
      {isLoading ? (
        <ActivityIndicator color="#000" size="small" />
      ) : (
        <Image source={require('../../assets/icons/gemini.png')} className="h-10 w-10" />
      )}
    </TouchableOpacity>
  );
}
