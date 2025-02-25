import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { NoteType } from '~/types';
// @ts-ignore
import HTMLView from 'react-native-htmlview';

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
      className={`mt-2 w-[49%] rounded-[0.75rem] ${
        selectedNotes.includes(note.id!) ? 'border-2 border-blue-400 bg-blue-100' : 'bg-[#FFFDFA]'
      } p-[1rem]`}
      onPress={() => handleNotePress(note.id!)}
      onLongPress={() => handleNoteLongPress(note.id!)}
      delayLongPress={300}
      activeOpacity={0.7}>
      <Text className="mb-2 truncate font-nunito-extra-bold text-lg font-semibold leading-tight text-text-primary">
        {note.title}
      </Text>
      {hasHtml(note.content) ? (
        <HTMLView
          value={note.content}
          stylesheet={{
            p: {
              fontFamily: 'Nunito-Regular',
              fontSize: 14,
              lineHeight: 20,
              color: '#6B7280',
            },
            ul: {
              marginLeft: 0,
              paddingLeft: 15,
            },
            li: {
              fontFamily: 'Nunito-Regular',
              fontSize: 14,
              lineHeight: 20,
              color: '#6B7280',
            },
            i: {
              fontStyle: 'italic',
            },
          }}
        />
      ) : (
        <Text
          className="font-nunito-regular text-sm leading-5 text-text-secondary"
          numberOfLines={3}>
          {note.content}
        </Text>
      )}
    </TouchableOpacity>
  );
}
