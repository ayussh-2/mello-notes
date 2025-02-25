import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Container } from '~/components/Container';
import Navbar from '~/components/layout/Navbar';
import CreateButton from '~/components/home/CreateButton';
import { router, useFocusEffect } from 'expo-router';
import { useNotesStore } from '~/store/notesStore';
import BottomBar from '~/components/home/BottomBar';
import ConfirmModal from '~/components/home/ConfirmModal';
import NoteCard from '~/components/home/NoteCard';
import SelectionBar from '~/components/home/SelectionBar';
export default function Home() {
  const { notes, fetchAllNotes, isLoading, addNotesToBin } = useNotesStore();

  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    fetchAllNotes();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAllNotes();
      return () => {};
    }, [])
  );

  function handleNotePress(id: string) {
    if (selectionMode) {
      toggleNoteSelection(id);
    } else {
      router.push(`/create/${id}`);
    }
  }

  function handleNoteLongPress(id: string) {
    if (!selectionMode) {
      setSelectionMode(true);
      setSelectedNotes([id]);
    }
  }

  function toggleNoteSelection(id: string) {
    setSelectedNotes((prev) => {
      if (prev.includes(id)) {
        const newSelection = prev.filter((noteId) => noteId !== id);
        if (newSelection.length === 0) {
          setSelectionMode(false);
        }
        return newSelection;
      } else {
        return [...prev, id];
      }
    });
  }

  function cancelSelection() {
    setSelectionMode(false);
    setSelectedNotes([]);
  }

  function confirmDeleteNotes() {
    setConfirmDelete(true);
  }

  async function executeDelete() {
    await addNotesToBin(selectedNotes);
    setSelectionMode(false);
    setSelectedNotes([]);
    setConfirmDelete(false);
    fetchAllNotes();
  }

  return (
    <Container>
      <Navbar>
        {selectionMode ? (
          <SelectionBar selectedNotes={selectedNotes} cancelSelection={cancelSelection} />
        ) : (
          <Text className="font-nunito-extra-bold text-xl font-semibold text-text-primary">
            Notes
          </Text>
        )}
      </Navbar>

      <ScrollView showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View className="flex-1 items-center justify-center py-10">
            <Text className="font-nunito-regular text-text-secondary">Loading notes...</Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap justify-between px-5">
            {notes.length === 0 ? (
              <View className="mt-10 w-full items-center">
                <Text className="font-nunito-regular text-xl text-text-secondary">
                  No notes yet. Create your first note!
                </Text>
              </View>
            ) : (
              notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  handleNotePress={handleNotePress}
                  handleNoteLongPress={handleNoteLongPress}
                  selectedNotes={selectedNotes}
                />
              ))
            )}
          </View>
        )}
      </ScrollView>

      {selectionMode && (
        <BottomBar selectedNotes={selectedNotes} confirmDeleteNotes={confirmDeleteNotes} />
      )}

      <ConfirmModal
        confirmDelete={confirmDelete}
        setConfirmDelete={setConfirmDelete}
        selectedNotes={selectedNotes}
        executeDelete={executeDelete}
      />

      {!selectionMode && <CreateButton />}
    </Container>
  );
}
