import { create } from 'zustand';
import { NoteType } from '~/types';
import {
  fetchNotes,
  addNote,
  updateNote,
  findNoteById,
  addNotesToBin as addToBin,
} from '~/utils/crud';
import { userStorage } from '~/utils/userStorage';

interface NotesState {
  notes: NoteType[];
  currentNote: NoteType | null;
  isLoading: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  contentChanged: boolean;

  fetchAllNotes: () => Promise<void>;
  createNote: (note: Omit<NoteType, 'id'>) => Promise<string | null>;
  updateNote: (id: string, note: Partial<NoteType>) => Promise<void>;
  getNoteById: (id: string) => Promise<void>;
  setCurrentNote: (note: NoteType | null) => void;
  setContentChanged: (changed: boolean) => void;
  setIsSaving: (saving: boolean) => void;
  addNotesToBin: (ids: string[]) => Promise<void>;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  currentNote: null,
  isLoading: false,
  isSaving: false,
  lastSaved: null,
  contentChanged: false,

  fetchAllNotes: async () => {
    set({ isLoading: true });
    try {
      const allNotes = await fetchNotes();
      if (allNotes) {
        set({ notes: allNotes });
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  createNote: async (note: Omit<NoteType, 'id'>) => {
    set({ isSaving: true });
    try {
      const user = await userStorage.getUser();
      const noteWithUserId = {
        ...note,
        user_id: user?.id || 'anonymous',
      };

      const savedData = await addNote(noteWithUserId);
      if (savedData && savedData.length > 0) {
        const newNote = savedData[0];
        set((state) => ({
          notes: [...state.notes, newNote],
          currentNote: newNote,
          lastSaved: new Date(),
          contentChanged: false,
        }));
        return newNote.id || null;
      }
      return null;
    } catch (error) {
      console.error('Error creating note:', error);
      return null;
    } finally {
      set({ isSaving: false });
    }
  },

  updateNote: async (id: string, note: Partial<NoteType>) => {
    set({ isSaving: true });
    try {
      await updateNote(id, note);

      set((state) => {
        const updatedNotes = state.notes.map((n) => (n.id === id ? { ...n, ...note } : n));

        const updatedCurrentNote =
          state.currentNote && state.currentNote.id === id
            ? { ...state.currentNote, ...note }
            : state.currentNote;

        return {
          notes: updatedNotes,
          currentNote: updatedCurrentNote,
          lastSaved: new Date(),
          contentChanged: false,
        };
      });
    } catch (error) {
      console.error('Error updating note:', error);
    } finally {
      set({ isSaving: false });
    }
  },

  getNoteById: async (id: string) => {
    if (id === 'new') {
      set({
        currentNote: {
          title: '',
          content: '',
          user_id: 'anonymous',
        },
        lastSaved: null,
      });
      return;
    }

    set({ isLoading: true });
    try {
      const note = await findNoteById(id);
      if (note) {
        set({
          currentNote: note,
          lastSaved: new Date(note.updated_at || note.created_at),
        });

        return note.id;
      }
    } catch (error) {
      console.error('Error finding note:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addNotesToBin: async (ids: string[]) => {
    try {
      await addToBin(ids);
      set((state) => ({
        notes: state.notes.filter((note) => !ids.includes(note.id!)),
      }));
    } catch (error) {
      console.error('Error adding notes to bin:', error);
    }
  },

  setCurrentNote: (note) => set({ currentNote: note }),
  setContentChanged: (changed) => set({ contentChanged: changed }),
  setIsSaving: (saving) => set({ isSaving: saving }),
}));
