import { useState } from 'react';
import { Alert } from 'react-native';

import { NotesSection } from '@/components/section/private/notes/notes.section';
import { useNotess } from '@/hooks/service/Note/useNotes';

export function MobileNotesContainer() {
  const { query, mutate } = useNotess();
  const { data: notes = [], isLoading, isError, refetch, isFetching } = query.get();
  const createNote = mutate.create();
  const deleteNote = mutate.delete();

  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleCreate = () => {
    if (!title.trim()) return;
    createNote.mutate(
      {
        title: title.trim(),
        content: content.trim() || '',
      },
      {
        onSuccess: () => {
          setTitle('');
          setContent('');
          setModalVisible(false);
        },
      },
    );
  };

  const handleDelete = (id: string) => {
    Alert.alert('Hapus catatan?', 'Catatan yang dihapus tidak dapat dikembalikan.', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => deleteNote.mutate(id),
      },
    ]);
  };

  return (
    <NotesSection
      service={{
        notes,
        isLoading,
        isError,
        isFetching,
        createPending: createNote.isPending,
        deletePending: deleteNote.isPending,
        onRetry: () => refetch(),
        onAddOpen: () => setModalVisible(true),
        onDelete: handleDelete,
        onSubmitCreate: handleCreate,
      }}
      state={{
        modalVisible,
        setModalVisible,
        title,
        setTitle,
        content,
        setContent,
      }}
    />
  );
}
