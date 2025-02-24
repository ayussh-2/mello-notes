export type NoteType = {
  id?: string;
  title: string;
  content: string;
  created_at?: string;
  updated_at?: string;
  user_id: string;
  is_deleted: boolean;
};
