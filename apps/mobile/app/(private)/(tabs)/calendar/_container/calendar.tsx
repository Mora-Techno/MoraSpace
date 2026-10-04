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
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Plus, Trash2, Calendar as CalendarIcon } from 'lucide-react-native';
import { useCalender } from '@/hooks/service/Calendar/useCalender';
import { useTheme } from '@/core/providers/theme.provinder';
import type { CalendarEvent } from '@repo/types';

export function MobileCalendarContainer() {
  const { colors, isDark } = useTheme();
  const { query, mutate } = useCalender();
  const { data: events = [], isLoading, isError, refetch, isFetching } = query.getCalender();
  const createEvent = mutate.create();
  const deleteEvent = mutate.delete();

  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = () => {
    if (!title.trim()) return;
    const now = new Date();
    const end = new Date(now.getTime() + 60 * 60 * 1000);

    createEvent.mutate(
      {
        title: title.trim(),
        description: description.trim() || null,
        startDate: now.toISOString(),
        endDate: end.toISOString(),
      },
      {
        onSuccess: () => {
          setTitle('');
          setDescription('');
          setModalVisible(false);
        },
      },
    );
  };

  const handleDelete = (id: string) => {
    Alert.alert('Hapus agenda?', 'Agenda yang dihapus tidak dapat dikembalikan.', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => deleteEvent.mutate({ id }),
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
              Kalender & Event
            </Text>
            <Text className="text-xs text-gray-500">Jadwal agenda mendatang</Text>
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
              Gagal memuat agenda.
            </Text>
            <Button title="Coba lagi" onPress={() => refetch()} color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={events}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl
                refreshing={isFetching && !isLoading}
                onRefresh={() => refetch()}
                tintColor={colors.primary}
              />
            }
            renderItem={({ item }) => (
              <View
                className="p-4 mb-3 rounded-xl border"
                style={{
                  backgroundColor: colors.card,
                  borderColor: isDark ? colors.border : '#e5e7eb',
                }}
              >
                <View className="flex-row items-start justify-between">
                  <View className="flex-1 mr-2">
                    <Text className="text-sm font-bold" style={{ color: colors.text }}>
                      {item.title}
                    </Text>
                    {item.description && (
                      <Text className="text-xs text-gray-500 mt-1">{item.description}</Text>
                    )}
                    <View className="flex-row items-center gap-1 mt-2">
                      <CalendarIcon size={12} color={colors.textSecondary} />
                      <Text className="text-[11px] text-gray-400">
                        {new Date(item.startDate).toLocaleString()}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleDelete(item.id)}
                    disabled={deleteEvent.isPending}
                    className="p-1"
                    style={{ opacity: deleteEvent.isPending ? 0.5 : 1 }}
                  >
                    <Trash2 size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <View className="items-center justify-center py-16">
                <Text className="text-xs text-gray-400">Belum ada agenda terdaftar.</Text>
              </View>
            }
          />
        )}

        {/* Modal Tambah Event */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
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
                Tambah Agenda Baru
              </Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Judul agenda..."
                placeholderTextColor={colors.textSecondary}
                className="p-3 border rounded-xl mb-3 text-sm"
                style={{
                  color: colors.text,
                  borderColor: colors.border,
                }}
              />
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Keterangan..."
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
                  disabled={createEvent.isPending}
                  className="px-4 py-2 rounded-lg"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Text className="text-white font-semibold text-xs">
                    {createEvent.isPending ? 'Menyimpan...' : 'Simpan'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
