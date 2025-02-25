import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Container } from '~/components/Container';
import Navbar from '~/components/layout/Navbar';
import CreateButton from '~/components/home/CreateButton';
import { fetchNotes } from '~/utils/crud';
import { NoteType } from '~/types';
// @ts-ignore
import HTMLView from 'react-native-htmlview';
import { router } from 'expo-router';

export default function Home() {
  const [notes, setNotes] = useState<NoteType[]>([]);

  async function fetchAllNotes() {
    try {
      const allNotes = await fetchNotes();
      if (allNotes) setNotes(allNotes);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  }

  useEffect(() => {
    fetchAllNotes();
  }, []);

  const hasHtml = (content: string) => {
    return (
      content &&
      (content.includes('<div>') ||
        content.includes('<ul>') ||
        content.includes('<li>') ||
        content.includes('<i>'))
    );
  };

  function handleOpenNote(id: string) {
    router.push(`/create/${id}`);
  }

  return (
    <Container>
      <Navbar>Notes</Navbar>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-wrap justify-between px-5">
          {notes.map((note) => (
            <TouchableOpacity
              key={note.id}
              className="mt-2 w-[49%] rounded-[0.75rem] bg-[#FFFDFA] p-[1rem]"
              onPress={() => handleOpenNote(note.id!)}
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
          ))}
        </View>
      </ScrollView>
      <CreateButton />
    </Container>
  );
}
