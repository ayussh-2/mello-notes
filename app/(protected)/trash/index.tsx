import { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Container } from '~/components/Container';
import NoteCard from '~/components/home/NoteCard';
import Navbar from '~/components/layout/Navbar';
import BottomBar from '~/components/trash/BottomBar';
import ConfirmationModal from '~/components/trash/ConfirmationModal';
import { NoteType } from '~/types';
import { fetchNotesFromBin, restoreNotes, deleteNotes } from '~/utils/crud';
import { userStorage } from '~/utils/userStorage';

export default function Trash() {
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    const user = await userStorage.getUser();
    const data = await fetchNotesFromBin(user?.id!);
    if (data) setNotes(data as unknown as NoteType[]);
  };

  const handleNotePress = (id: string) => {
    setSelectedNotes((prev) =>
      prev.includes(id) ? prev.filter((noteId) => noteId !== id) : [...prev, id]
    );
  };

  const handleNoteLongPress = (id: string) => {
    handleNotePress(id);
  };

  const handleRestore = async () => {
    setConfirmModalVisible(false);
    await restoreNotes(selectedNotes);
    setNotes(notes.filter((n) => !selectedNotes.includes(n?.id!)));
    setSelectedNotes([]);
  };

  const handleDelete = async () => {
    setConfirmModalVisible(true);
  };

  const executeDelete = async () => {
    setConfirmModalVisible(false);
    await deleteNotes(selectedNotes);
    setNotes(notes.filter((n) => !selectedNotes.includes(n?.id!)));
    setSelectedNotes([]);
  };

  return (
    <Container>
      <Navbar>
        <Text className="text-center font-nunito-extra-bold text-2xl">Trash</Text>
      </Navbar>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="w-full flex-row flex-wrap justify-between px-5">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              selectedNotes={selectedNotes}
              handleNotePress={handleNotePress}
              handleNoteLongPress={handleNoteLongPress}
            />
          ))}
        </View>
        <ConfirmationModal
          visible={confirmModalVisible}
          onClose={() => setConfirmModalVisible(false)}
          onConfirm={executeDelete}
          title="Confirm Delete"
          message={
            selectedNotes.length === 1
              ? 'Are you sure you want to permanently delete this note?'
              : `Are you sure you want to permanently delete these ${selectedNotes.length} notes?`
          }
          confirmText="Delete"
          cancelText="Cancel"
          confirmColor="text-red-500"
        />
      </ScrollView>

      {selectedNotes.length > 0 && (
        <BottomBar
          selectedNotes={selectedNotes}
          handleDelete={handleDelete}
          handleRestore={handleRestore}
        />
      )}
    </Container>
  );
}
