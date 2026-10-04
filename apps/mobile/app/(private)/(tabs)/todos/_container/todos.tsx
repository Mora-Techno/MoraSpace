import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
  Button,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react-native';
import { useTodo } from '@/hooks/service/Todo/useTodo';
import { useTheme } from '@/core/providers/theme.provinder';
import type { Todo } from '@repo/types';

export function MobileTodoContainer() {
  const { colors, isDark } = useTheme();
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
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View className="flex-1 p-4" style={{ backgroundColor: colors.background }}>
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-xl font-bold" style={{ color: colors.text }}>
              Daftar Tugas
            </Text>
            <Text className="text-xs text-gray-500">Kelola kegiatan harianmu</Text>
          </View>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            className="p-2.5 rounded-full"
            style={{ backgroundColor: colors.primary }}
          >
            <Plus size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : isError ? (
          <View className="flex-1 items-center justify-center gap-2">
            <Text className="text-sm" style={{ color: colors.text }}>
              Gagal memuat tugas.
            </Text>
            <Button title="Coba lagi" onPress={() => refetch()} color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={todos}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl
                refreshing={isFetching && !isLoading}
                onRefresh={() => refetch()}
                tintColor={colors.primary}
              />
            }
            renderItem={({ item }) => {
              const isCompleted = item.status === 'completed';
              return (
                <View
                  className="flex-row items-center justify-between p-3.5 mb-2.5 rounded-xl border"
                  style={{
                    backgroundColor: colors.card,
                    borderColor: isDark ? colors.border : '#e5e7eb',
                  }}
                >
                  <TouchableOpacity
                    onPress={() => handleToggle(item)}
                    className="flex-row items-center flex-1 mr-2"
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={20} color="#10b981" />
                    ) : (
                      <Circle size={20} color={colors.textSecondary} />
                    )}
                    <Text
                      className={`ml-3 text-sm font-medium ${
                        isCompleted ? 'line-through text-gray-400' : ''
                      }`}
                      style={!isCompleted ? { color: colors.text } : undefined}
                    >
                      {item.text}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleDelete(item.id)}
                    disabled={deleteTodo.isPending}
                    className="p-1"
                    style={{ opacity: deleteTodo.isPending ? 0.5 : 1 }}
                  >
                    <Trash2 size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              );
            }}
            ListEmptyComponent={
              <View className="items-center justify-center py-16">
                <Text className="text-xs text-gray-400">Belum ada tugas.</Text>
              </View>
            }
          />
        )}

        {/* Modal Tambah Todo */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={80}
            className="flex-1"
          >
            <View className="flex-1 items-center justify-center bg-black/50 p-4">
              <View
                className="w-full max-w-sm p-5 rounded-2xl border"
                style={{
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                }}
              >
                <Text className="text-base font-bold mb-3" style={{ color: colors.text }}>
                  Tambah Tugas Baru
                </Text>
                <TextInput
                  value={text}
                  onChangeText={setText}
                  placeholder="Tuliskan tugas..."
                  placeholderTextColor={colors.textSecondary}
                  className="p-3 border rounded-xl mb-4 text-sm"
                  style={{
                    color: colors.text,
                    borderColor: colors.border,
                  }}
                />
                <View className="flex-row justify-end gap-2">
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    className="px-4 py-2 rounded-lg"
                  >
                    <Text style={{ color: colors.textSecondary }}>Batal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleCreate}
                    disabled={createTodo.isPending}
                    className="px-4 py-2 rounded-lg"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Text className="text-white font-semibold text-xs">
                      {createTodo.isPending ? 'Menyimpan...' : 'Simpan'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
