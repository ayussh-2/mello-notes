import { supabase } from './supabase';
import { handleAsync } from '../utils/asyncHandler';
import { NoteType } from '~/types';
export const fetchNotes = () =>
  handleAsync(async () => {
    const { data, error } = await supabase.from('notes').select('*');
    if (error) console.error(error);
    return data;
  });

export const findNoteById = (id: string) => {
  return handleAsync(async () => {
    const { data, error } = await supabase.from('notes').select('*').eq('id', id).single();
    if (error) console.error(error);

    return data;
  });
};
export const addNote = (note: NoteType) =>
  handleAsync(async () => {
    const { data, error } = await supabase.from('notes').insert([note]).select();
    if (error) console.error(error);
    return data;
  }, 'Note added!');

export const updateNote = (id: string, updates: any) =>
  handleAsync(async () => {
    const { data, error } = await supabase.from('notes').update(updates).eq('id', id);
    if (error) console.error(error);

    return data;
  }, 'Note updated!');

export const deleteNote = (id: string) =>
  handleAsync(async () => {
    const { error } = await supabase.from('notes').delete().eq('id', id);
    if (error) console.error(error);

    return { success: true };
  }, 'Note deleted!');
