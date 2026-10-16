import type { Todo } from '@repo/types';
import { useState } from 'react';
import { Alert } from 'react-native';

import { TodosSection } from '@/components/section/private/todos/todos.section';
import { useTodo } from '@/hooks/service/Todo/useTodo';

export function MobileTodoContainer() {
  const { query, mutate } = useTodo();
  const { data: todos = [], isLoading, isError, refetch, isFetching } = query.get();
  const createTodo = mutate.create();
  const updateTodo = mutate.update();
  const deleteTodo = mutate.delete();

  const [modalVisible, setModalVisible] = useState(false);
  const [text, setText] = useState('');

  const handleCreate = () => {
    if (!text.trim()) return;
    createTodo.mutate(
      { text: text.trim() },
      {
        onSuccess: () => {
          setText('');
          setModalVisible(false);
        },
      },
    );
  };

  const handleToggle = (todo: Todo) => {
    const nextStatus = todo.status === 'completed' ? 'pending' : 'completed';
    updateTodo.mutate({
      id: todo.id,
      payload: { status: nextStatus },
    });
  };

  const handleDelete = (id: string) => {
    Alert.alert('Hapus tugas?', 'Tugas yang dihapus tidak dapat dikembalikan.', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => deleteTodo.mutate(id),
      },
    ]);
  };

  return (
    <TodosSection
      service={{
        todos,
        isLoading,
        isError,
        isFetching,
        createPending: createTodo.isPending,
        deletePending: deleteTodo.isPending,
        onRetry: () => refetch(),
        onAddOpen: () => setModalVisible(true),
        onToggle: handleToggle,
        onDelete: handleDelete,
        onSubmitCreate: handleCreate,
      }}
      state={{
        modalVisible,
        setModalVisible,
        text,
        setText,
      }}
    />
  );
}
