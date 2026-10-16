import type { CalendarEvent } from '@repo/types';
import { StatusBar } from 'expo-status-bar';
import { Calendar as CalendarIcon, Plus, Trash2 } from 'lucide-react-native';
import {
  ActivityIndicator,
  Button,
  FlatList,
  Modal,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/core/providers/theme.provinder';

interface CalendarSectionProps {
  service: {
    events: CalendarEvent[];
    isLoading: boolean;
    isError: boolean;
    isFetching: boolean;
    createPending: boolean;
    deletePending: boolean;
    onRetry: () => void;
    onAddOpen: () => void;
    onDelete: (id: string) => void;
    onSubmitCreate: () => void;
  };
  state: {
    modalVisible: boolean;
    setModalVisible: (v: boolean) => void;
    title: string;
    setTitle: (v: string) => void;
    description: string;
    setDescription: (v: string) => void;
  };
}

export function CalendarSection({ service, state }: CalendarSectionProps) {
  const { colors, isDark } = useTheme();
  const {
    events,
    isLoading,
    isError,
    isFetching,
    createPending,
    deletePending,
    onRetry,
    onAddOpen,
    onDelete,
    onSubmitCreate,
  } = service;
  const { modalVisible, setModalVisible, title, setTitle, description, setDescription } = state;

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
            onPress={onAddOpen}
            className="p-2.5 rounded-full"
            style={{ backgroundColor: colors.primary }}
          >
            <Plus size={20} color={colors.primaryForeground} />
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
            <Button title="Coba lagi" onPress={onRetry} color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={events}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl
                refreshing={isFetching && !isLoading}
                onRefresh={onRetry}
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
                    onPress={() => onDelete(item.id)}
                    disabled={deletePending}
                    className="p-1"
                    style={{ opacity: deletePending ? 0.5 : 1 }}
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
                  onPress={onSubmitCreate}
                  disabled={createPending}
                  className="px-4 py-2 rounded-lg"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Text className="text-primary-foreground font-semibold text-xs">
                    {createPending ? 'Menyimpan...' : 'Simpan'}
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
