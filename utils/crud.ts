import { supabase } from './supabase';
import { handleAsync } from '../utils/asyncHandler';

export const fetchNotes = () =>
  handleAsync(async () => {
    let { data, error } = await supabase.from('notes').select('*');
    return data;
  });

export const addNote = (note: { title: string; content: string }) =>
  handleAsync(async () => {
    let { data, error } = await supabase.from('notes').insert([note]);
    return data;
  }, 'Note added!');

export const updateNote = (id: string, updates: any) =>
  handleAsync(async () => {
    let { data, error } = await supabase.from('notes').update(updates).eq('id', id);
    return data;
  }, 'Note updated!');

export const deleteNote = (id: string) =>
  handleAsync(async () => {
    let { error } = await supabase.from('notes').delete().eq('id', id);
    return { success: true };
  }, 'Note deleted!');
