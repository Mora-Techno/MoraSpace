import type { ITask, PickCreateTask, TaskStatusOption } from '@repo/types/task.types';
import { StatusBar } from 'expo-status-bar';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  Plus,
  Trash2,
  UserCheck,
} from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import { useTask } from '@/hooks/service/Task/useTask';
import { useAppSelector } from '@/hooks/toolkit/redux';

export function MobileTasksContainer() {
  const { colors, isDark } = useTheme();
  const currentUser = useAppSelector((state) => state.auth.currentUser?.user);
  const isOwner = currentUser?.companyRole?.toLowerCase() === 'owner';

  const { query, mutate } = useTask();
  const { data: rawTasks = [], isLoading, isError, refetch, isFetching } = query.list();
  const { data: rawStatuses = [] } = query.statuses();

  const createTask = mutate.create();
  const updateStatus = mutate.updateStatus();
  const deleteTask = mutate.delete();

  // Status default fallback jika API statuses belum di-seed
  const statuses: TaskStatusOption[] = useMemo(() => {
    if (rawStatuses && rawStatuses.length > 0) {
      return rawStatuses;
    }
    return [
      { id: 'todo', companyId: '', name: 'To Do', color: '#64748b', sortOrder: 1 },
      { id: 'in_progress', companyId: '', name: 'In Progress', color: '#3b82f6', sortOrder: 2 },
      { id: 'done', companyId: '', name: 'Done', color: '#10b981', sortOrder: 3 },
    ];
  }, [rawStatuses]);

  const [activeStatusId, setActiveStatusId] = useState<string>('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newStatusId, setNewStatusId] = useState('');

  // Role-Aware Task Filter (Spaces v0.0.1 Rule: Owner = all, Member = own)
  const accessibleTasks = useMemo(() => {
    if (!Array.isArray(rawTasks)) return [];
    if (isOwner) return rawTasks;

    const myId = currentUser?.id;
    const myMemberId = currentUser?.companyMemberId;

    return rawTasks.filter((task) => {
      const isReporter =
        (myMemberId && task.reporterMemberId === myMemberId) ||
        (myId && task.reporterMemberId === myId);
      const isAssignee = false;
      return isReporter || isAssignee;
    });
  }, [rawTasks, isOwner, currentUser]);

  const displayedTasks = useMemo(() => {
    if (activeStatusId === 'all') return accessibleTasks;
    return accessibleTasks.filter((task) => task.statusId === activeStatusId);
  }, [accessibleTasks, activeStatusId]);

  const handleCreate = () => {
    if (!newTitle.trim()) {
      Alert.alert('Validasi', 'Judul tugas wajib diisi.');
      return;
    }

    const payloadStatusId = newStatusId || statuses[0]?.id || 'todo';
    const payload: PickCreateTask = {
      title: newTitle.trim(),
      description: newDescription.trim() || undefined,
      statusId: payloadStatusId,
    };

    createTask.mutate(payload, {
      onSuccess: () => {
        setNewTitle('');
        setNewDescription('');
        setModalVisible(false);
      },
      onError: (err: any) => {
        Alert.alert('Gagal', err?.message || 'Gagal membuat tugas.');
      },
    });
  };

  const handleStatusChange = (taskId: string, targetStatusId: string) => {
    updateStatus.mutate({
      id: taskId,
      payload: { statusId: targetStatusId },
    });
  };

  const handleDelete = (id: string) => {
    Alert.alert('Hapus Tugas', 'Tugas yang dihapus tidak dapat dipulihkan.', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => deleteTask.mutate(id),
      },
    ]);
  };

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
            onPress={() => {
              setNewStatusId(statuses[0]?.id || '');
              setModalVisible(true);
            }}
            className="p-2.5 rounded-full"
            style={{ backgroundColor: colors.primary }}
          >
            <Plus size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Status Horizontal Tabs */}
        <View className="mb-3">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => setActiveStatusId('all')}
              className="px-3.5 py-1.5 rounded-xl border mr-2"
              style={{
                backgroundColor: activeStatusId === 'all' ? colors.primary : colors.card,
                borderColor: activeStatusId === 'all' ? colors.primary : colors.border,
              }}
            >
              <Text
                className="text-xs font-semibold"
                style={{ color: activeStatusId === 'all' ? '#fff' : colors.text }}
              >
                Semua ({accessibleTasks.length})
              </Text>
            </TouchableOpacity>

            {statuses.map((s) => {
              const count = accessibleTasks.filter((t) => t.statusId === s.id).length;
              const isActive = activeStatusId === s.id;
              return (
                <TouchableOpacity
                  key={s.id}
                  onPress={() => setActiveStatusId(s.id)}
                  className="px-3.5 py-1.5 rounded-xl border mr-2"
                  style={{
                    backgroundColor: isActive ? colors.primary : colors.card,
                    borderColor: isActive ? colors.primary : colors.border,
                  }}
                >
                  <Text
                    className="text-xs font-semibold"
                    style={{ color: isActive ? '#fff' : colors.text }}
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
              onPress={() => refetch()}
              className="px-4 py-2 rounded-lg"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-white text-xs font-semibold">Coba lagi</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={displayedTasks}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl
                refreshing={isFetching && !isLoading}
                onRefresh={() => refetch()}
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
                              onPress={() => handleStatusChange(item.id, s.id)}
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
                      onPress={() => handleDelete(item.id)}
                      disabled={deleteTask.isPending}
                      className="p-1"
                      style={{ opacity: deleteTask.isPending ? 0.5 : 1 }}
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
              <View className="flex-row flex-wrap gap-2 mb-4">
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
                      style={{ color: newStatusId === s.id ? '#fff' : colors.text }}
                    >
                      {s.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View className="flex-row justify-end gap-2">
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  className="px-4 py-2 rounded-lg"
                >
                  <Text style={{ color: colors.textSecondary }}>Batal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleCreate}
                  disabled={createTask.isPending}
                  className="px-4 py-2 rounded-lg"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Text className="text-white font-semibold text-xs">
                    {createTask.isPending ? 'Menyimpan...' : 'Simpan Tugas'}
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
