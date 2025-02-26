import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { NoteType } from '~/types';
// @ts-ignore
import HTMLView from 'react-native-htmlview';
import { LinearGradient } from 'expo-linear-gradient';

interface NoteCardProps {
  note: NoteType;
  selectedNotes: string[];
  handleNotePress: (id: string) => void;
  handleNoteLongPress: (id: string) => void;
}

export default function NoteCard({
  note,
  selectedNotes,
  handleNotePress,
  handleNoteLongPress,
}: NoteCardProps) {
  const hasHtml = (content: string) => {
    return (
      content &&
      (content.includes('<div>') ||
        content.includes('<ul>') ||
        content.includes('<li>') ||
        content.includes('<i>'))
    );
  };

  return (
    <TouchableOpacity
      key={note.id}
      className={`mt-2 w-full rounded-[0.75rem] ${
        selectedNotes.includes(note.id!)
          ? 'border-2 border-primary-500 bg-primary-100'
          : 'bg-[#FFFDFA]'
      }  p-[1rem]`}
      onPress={() => handleNotePress(note.id!)}
      onLongPress={() => handleNoteLongPress(note.id!)}
      delayLongPress={300}
      activeOpacity={0.7}>
      <Text className="mb-2 truncate font-nunito-extra-bold text-lg font-semibold leading-tight text-text-primary">
        {note.title}
      </Text>

      <View className="relative max-h-[10rem] overflow-hidden">
        <HTMLView value={note.content} />

        <LinearGradient
          colors={['transparent', 'rgba(255, 253, 250, 0.9)', 'rgba(255, 253, 250, 1)']}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 10,
          }}
        />
      </View>
    </TouchableOpacity>
  );
}
