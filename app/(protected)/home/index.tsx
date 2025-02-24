import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Container } from '~/components/Container';
import Navbar from '~/components/layout/Navbar';
import CreateButton from '~/components/home/CreateButton';

interface Note {
  id: string;
  title: string;
  content?: string;
  type: 'regular' | 'list' | 'checklist';
  items?: string[];
  checkItems?: { text: string; checked: boolean }[];
}

const NOTES: Note[] = [
  {
    id: '1',
    title: 'Cerebral palsy sport',
    content:
      'Cerebral palsy sport classification is a classification system used by sports that include people with cerebral palsy (CP) with different degrees of severity to compete fairly against each...',
    type: 'regular',
  },
  {
    id: '2',
    title: 'Trends List',
    type: 'list',
    items: [
      'Glassmorphism',
      'Claymorphism',
      'Big Typography',
      '3d Illustrations',
      'Flat Colors...',
    ],
  },
  {
    id: '3',
    title: 'School Essay on Accessibility',
    content:
      'Accessibility is the practice of making your websites usable by as many people as possible. We traditionally think of this as being about people with disabilities...',
    type: 'regular',
  },
  {
    id: '4',
    title: 'Emotions of Typography',
    content:
      'Typography is a part of user interface. Many of us focus on User Experience rather than User Interface as a novice UI/UX designer since deciding a typeface, colors, and typefaces is a pain as it takes a lot of...',
    type: 'regular',
  },
  {
    id: '5',
    title: 'Groceries',
    type: 'checklist',
    checkItems: [
      { text: '2x Apples', checked: false },
      { text: '6x Eggs', checked: false },
      { text: '1x Broccoli', checked: false },
      { text: '5x Maggie L', checked: false },
      { text: '2x Cupcakes', checked: false },
      { text: '3x Ball Pens', checked: false },
    ],
  },
  {
    id: '6',
    title: 'IG Posts',
    type: 'list',
    items: ['Typography Checklist', 'Make 3D Card'],
  },
  {
    id: '7',
    title: 'Lamina Peak',
    content: "Lamina Peak (70°32'S",
    type: 'regular',
  },
];

export default function NotesScreen() {
  return (
    <Container>
      <Navbar>Notes</Navbar>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-wrap justify-between px-5">
          {NOTES.map((note) => (
            <TouchableOpacity
              key={note.id}
              className="mt-2 w-[49%] rounded-[0.75rem] bg-[#FFFDFA] p-[1rem]">
              <Text className="mb-2 truncate font-nunito-extra-bold text-lg font-semibold leading-tight text-text-primary">
                {note.title}
              </Text>

              {note.type === 'regular' && (
                <Text
                  className="font-nunito-regular text-sm leading-5 text-text-secondary"
                  numberOfLines={3}>
                  {note.content}
                </Text>
              )}

              {note.type === 'list' && (
                <View className="space-y-1">
                  {note.items?.map((item, index) => (
                    <Text key={index} className="font-nunito-regular text-sm text-text-secondary">
                      • {item}
                    </Text>
                  ))}
                </View>
              )}

              {note.type === 'checklist' && (
                <View className="space-y-2">
                  {note.checkItems?.map((item, index) => (
                    <View key={index} className="flex-row items-center">
                      <View className="mr-2 h-4 w-4 rounded border-2 border-text-secondary" />
                      <Text className="flex-1 font-nunito-regular text-sm text-text-secondary">
                        {item.text}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <CreateButton />
    </Container>
  );
}
