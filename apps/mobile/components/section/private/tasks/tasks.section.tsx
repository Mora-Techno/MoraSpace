import { StatusBar } from 'expo-status-bar';
import { Clock, Plus, Trash2 } from 'lucide-react-native';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/core/providers/theme.provinder';

interface TasksSectionProps {
  service: {
    isOwner: boolean;
    tasks: any[];
    statuses: { id: string; name: string; color?: string | null }[];
    members: any[];
    statusMap: Map<string, any>;
    counts: { all: number; byStatus: Record<string, number> };
    isLoading: boolean;
    isError: boolean;
    isFetching: boolean;
    createPending: boolean;
    deletePending: boolean;
    selectedAssigneeStatus: { status: string; statusLabel: string } | null;
    onRetry: () => void;
    onAddOpen: () => void;
    onStatusTab: (id: string) => void;
    onStatusChange: (taskId: string, statusId: string) => void;
    onDelete: (id: string) => void;
    onSubmitCreate: () => void;
    onToggleAssignee: (id: string) => void;
  };
  state: {
    activeStatusId: string;
    modalVisible: boolean;
    setModalVisible: (v: boolean) => void;
    newTitle: string;
    setNewTitle: (v: string) => void;
    newDescription: string;
    setNewDescription: (v: string) => void;
    newStatusId: string;
    setNewStatusId: (v: string) => void;
    newAssigneeId: string;
    setNewAssigneeId: (v: string) => void;
  };
}

export function TasksSection({ service, state }: TasksSectionProps) {
  const { colors, isDark } = useTheme();
  const {
    isOwner,
    tasks,
    statuses,
    members,
    statusMap,
    counts,
    isLoading,
    isError,
    isFetching,
    createPending,
    deletePending,
    selectedAssigneeStatus,
    onRetry,
    onAddOpen,
    onStatusTab,
    onStatusChange,
    onDelete,
    onSubmitCreate,
    onToggleAssignee,
  } = service;
  const {
    activeStatusId,
    modalVisible,
    setModalVisible,
    newTitle,
    setNewTitle,
    newDescription,
    setNewDescription,
    newStatusId,
    setNewStatusId,
    newAssigneeId,
  } = state;

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View className="flex-1 p-4" style={{ backgroundColor: colors.background }}>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <Text className="text-xl font-bold" style={{ color: colors.text }}>
              Manajemen Tugas
            </Text>
            <Text className="text-xs text-gray-500">
              {isOwner ? 'Semua tugas perusahaan (Owner)' : 'Tugas saya (Member)'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={onAddOpen}
            className="p-2.5 rounded-full"
            style={{ backgroundColor: colors.primary }}
          >
            <Plus size={20} color={colors.primaryForeground} />
          </TouchableOpacity>
        </View>

        {/* Status Horizontal Tabs */}
        <View className="mb-3">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => onStatusTab('all')}
              className="px-3.5 py-1.5 rounded-xl border mr-2"
              style={{
                backgroundColor: activeStatusId === 'all' ? colors.primary : colors.card,
                borderColor: activeStatusId === 'all' ? colors.primary : colors.border,
              }}
            >
              <Text
                className="text-xs font-semibold"
                style={{ color: activeStatusId === 'all' ? colors.primaryForeground : colors.text }}
              >
                Semua ({counts.all})
              </Text>
            </TouchableOpacity>

            {statuses.map((s) => {
              const count = counts.byStatus[s.id] ?? 0;
              const isActive = activeStatusId === s.id;
              return (
                <TouchableOpacity
                  key={s.id}
                  onPress={() => onStatusTab(s.id)}
                  className="px-3.5 py-1.5 rounded-xl border mr-2"
                  style={{
                    backgroundColor: isActive ? colors.primary : colors.card,
                    borderColor: isActive ? colors.primary : colors.border,
                  }}
                >
                  <Text
                    className="text-xs font-semibold"
                    style={{ color: isActive ? colors.primaryForeground : colors.text }}
                  >
                    {s.name} ({count})
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Task List */}
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : isError ? (
          <View className="flex-1 items-center justify-center gap-2">
            <Text className="text-sm" style={{ color: colors.text }}>
              Gagal memuat tugas tim.
            </Text>
            <TouchableOpacity
              onPress={onRetry}
              className="px-4 py-2 rounded-lg"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-primary-foreground text-xs font-semibold">Coba lagi</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl
                refreshing={isFetching && !isLoading}
                onRefresh={onRetry}
                tintColor={colors.primary}
              />
            }
            renderItem={({ item }) => {
              const currentStatus = statuses.find((s) => s.id === item.statusId);
              return (
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
                      {item.description ? (
                        <Text className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {item.description}
                        </Text>
                      ) : null}

                      {/* Status Badge & Actions */}
                      <View className="flex-row items-center gap-2 mt-3 flex-wrap">
                        <View
                          className="px-2 py-0.5 rounded-md"
                          style={{
                            backgroundColor: (currentStatus?.color || colors.primary) + '20',
                          }}
                        >
                          <Text
                            className="text-[11px] font-semibold"
                            style={{ color: currentStatus?.color || colors.primary }}
                          >
                            {currentStatus?.name || 'Tugas'}
                          </Text>
                        </View>

                        {/* Quick Status Cycler */}
                        {statuses.map((s) => {
                          if (s.id === item.statusId) return null;
                          return (
                            <TouchableOpacity
                              key={s.id}
                              onPress={() => onStatusChange(item.id, s.id)}
                              className="px-2 py-0.5 rounded-md border"
                              style={{ borderColor: colors.border }}
                            >
                              <Text className="text-[10px]" style={{ color: colors.textSecondary }}>
                                → {s.name}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
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
              );
            }}
            ListEmptyComponent={
              <View className="items-center justify-center py-16">
                <Text className="text-xs text-gray-400">Tidak ada tugas pada kategori ini.</Text>
              </View>
            }
          />
        )}

        {/* Modal Tambah Task */}
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
                Tambah Tugas Baru
              </Text>
              <TextInput
                value={newTitle}
                onChangeText={setNewTitle}
                placeholder="Judul tugas..."
                placeholderTextColor={colors.textSecondary}
                className="p-3 border rounded-xl mb-3 text-sm"
                style={{
                  color: colors.text,
                  borderColor: colors.border,
                }}
              />
              <TextInput
                value={newDescription}
                onChangeText={setNewDescription}
                placeholder="Deskripsi tugas (opsional)..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={3}
                className="p-3 border rounded-xl mb-4 text-sm"
                style={{
                  color: colors.text,
                  borderColor: colors.border,
                  textAlignVertical: 'top',
                }}
              />

              <Text className="text-xs text-gray-400 mb-2">Pilih Status Awal:</Text>
              <View className="flex-row flex-wrap gap-2 mb-3">
                {statuses.map((s) => (
                  <TouchableOpacity
                    key={s.id}
                    onPress={() => setNewStatusId(s.id)}
                    className="px-3 py-1.5 rounded-lg border"
                    style={{
                      backgroundColor: newStatusId === s.id ? colors.primary : 'transparent',
                      borderColor: newStatusId === s.id ? colors.primary : colors.border,
                    }}
                  >
                    <Text
                      className="text-xs"
                      style={{
                        color: newStatusId === s.id ? colors.primaryForeground : colors.text,
                      }}
                    >
                      {s.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text className="text-xs text-gray-400 mb-2">Tugaskan Kepada (Opsional):</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row gap-2 mb-3"
              >
                <TouchableOpacity
                  onPress={() => onToggleAssignee('')}
                  className="px-3 py-1.5 rounded-lg border mr-2"
                  style={{
                    backgroundColor: newAssigneeId === '' ? colors.primary : 'transparent',
                    borderColor: newAssigneeId === '' ? colors.primary : colors.border,
                  }}
                >
                  <Text
                    className="text-xs"
                    style={{ color: newAssigneeId === '' ? colors.primaryForeground : colors.text }}
                  >
                    Tanpa Assignee
                  </Text>
                </TouchableOpacity>
                {members.map((m) => {
                  const s = statusMap.get(m.id) || statusMap.get(m.userId);
                  const isSelected = newAssigneeId === m.id;
                  return (
                    <TouchableOpacity
                      key={m.id}
                      onPress={() => onToggleAssignee(m.id)}
                      className="px-3 py-1.5 rounded-lg border mr-2 flex-row items-center gap-1.5"
                      style={{
                        backgroundColor: isSelected ? colors.primary : 'transparent',
                        borderColor: isSelected ? colors.primary : colors.border,
                      }}
                    >
                      <Text
                        className="text-xs"
                        style={{ color: isSelected ? colors.primaryForeground : colors.text }}
                      >
                        {m.user?.fullName || m.fullName || 'Member'}
                      </Text>
                      {s && (
                        <View
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor: s.status === 'working' ? '#10b981' : '#9ca3af',
                          }}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {selectedAssigneeStatus?.status === 'out_of_hours' ? (
                <View
                  className="p-2.5 rounded-xl border mb-3 flex-row items-center gap-1.5"
                  style={{ backgroundColor: colors.card, borderColor: colors.border }}
                >
                  <Clock size={12} color={colors.textSecondary} />
                  <Text className="text-[11px] flex-1" style={{ color: colors.textSecondary }}>
                    Rekan di luar jam kerja. Tugas sampai{' '}
                    <Text className="font-bold" style={{ color: colors.text }}>
                      {selectedAssigneeStatus.statusLabel.replace(/^Kembali\s*/i, '')}
                    </Text>
                  </Text>
                </View>
              ) : null}

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
                    {createPending ? 'Menyimpan...' : 'Simpan Tugas'}
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
