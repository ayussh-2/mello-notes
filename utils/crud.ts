import { supabase } from './supabase';
import { handleAsync } from '../utils/asyncHandler';
import { NoteType } from '~/types';
export const fetchNotes = () =>
  handleAsync(async () => {
    let { data, error } = await supabase.from('notes').select('*');
    if (error) console.error(error);
    return data;
  });

export const addNote = (note: NoteType) =>
  handleAsync(async () => {
    let { data, error } = await supabase.from('notes').insert([note]);
    if (error) console.error(error);
    return data;
  }, 'Note added!');

export const updateNote = (id: string, updates: any) =>
  handleAsync(async () => {
    let { data, error } = await supabase.from('notes').update(updates).eq('id', id);
    if (error) console.error(error);

    return data;
  }, 'Note updated!');

export const deleteNote = (id: string) =>
  handleAsync(async () => {
    let { error } = await supabase.from('notes').delete().eq('id', id);
    if (error) console.error(error);

    return { success: true };
  }, 'Note deleted!');
