/** Mirror Prisma model `Note` */
export interface INote {
  id: string;
  moduleId?: string | null;
  folderId?: string | null;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Note = Pick<INote, 'id' | 'title' | 'content'> & {
  moduleId?: string | null;
  folderId?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type NoteQuery = {
  search?: string;
  moduleId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  folderId?: string;
  startDate?: string;
  endDate?: string;
};

export type PickCreateNote = Pick<INote, 'title' | 'content'> & {
  moduleId?: string | null;
  folderId?: string | null;
};
export type PickUpdateNote = Pick<INote, 'title' | 'content'> & {
  moduleId?: string | null;
  folderId?: string | null;
};
export type NoteParams = Pick<INote, 'id'>;
