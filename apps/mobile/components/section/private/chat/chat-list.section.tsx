import { MessageCircle, Plus, Search, Users } from 'lucide-react-native';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Text } from '@/components/ui/text';
import { useTheme } from '@/core/providers/theme.provinder';

export interface ChatListItemVM {
  id: string;
  displayName: string;
  preview: string;
  memberSuffix: string | null;
  timeLabel: string;
  unreadLabel: string | null;
  initials: string;
}

export interface ChatUserVM {
  id: string;
  fullName: string;
  email: string;
  initials: string;
}

interface ChatListSectionProps {
  service: {
    conversations: ChatListItemVM[];
    users: ChatUserVM[];
    isLoading: boolean;
    isError: boolean;
    isSearching: boolean;
    connected: boolean;
    openDirectPending: boolean;
    createGroupPending: boolean;
    pickedCount: number;
    onRetry: () => void;
    onOpenConversation: (id: string) => void;
    onStartDirect: (userId: string) => void;
    onSubmitGroup: () => void;
    onTogglePick: (id: string) => void;
  };
  state: {
    filter: string;
    setFilter: (v: string) => void;
    showNew: boolean;
    setShowNew: (v: boolean) => void;
    showGroup: boolean;
    setShowGroup: (v: boolean) => void;
    userQuery: string;
    setUserQuery: (v: string) => void;
    groupName: string;
    setGroupName: (v: string) => void;
    picked: string[];
  };
}

export function ChatListSection({ service, state }: ChatListSectionProps) {
  const { colors } = useTheme();
  const {
    conversations,
    users,
    isLoading,
    isError,
    isSearching,
    connected,
    openDirectPending,
    createGroupPending,
    pickedCount,
    onRetry,
    onOpenConversation,
    onStartDirect,
    onSubmitGroup,
    onTogglePick,
  } = service;
  const {
    filter,
    setFilter,
    showNew,
    setShowNew,
    showGroup,
    setShowGroup,
    userQuery,
    setUserQuery,
    groupName,
    setGroupName,
    picked,
  } = state;

  return (
    <View className="flex-1 px-4 pt-4" style={{ backgroundColor: colors.background }}>
      <View className="flex-row items-center mb-3">
        <View className="flex-1">
          <Text className="text-xl font-bold" style={{ color: colors.text }}>
            Chat
          </Text>
          <Text className="text-xs" style={{ color: colors.textSecondary }}>
            {connected ? 'Terhubung' : 'Menghubungkan...'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowGroup(true)}
          className="flex-row items-center px-3 py-2 rounded-xl border mr-2"
          style={{ borderColor: colors.border }}
        >
          <Users size={16} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowNew(true)}
          className="flex-row items-center px-3 py-2 rounded-xl"
          style={{ backgroundColor: colors.primary }}
        >
          <Plus size={16} color={colors.primaryForeground} />
          <Text className="text-xs font-semibold ml-1" style={{ color: colors.primaryForeground }}>
            Baru
          </Text>
        </TouchableOpacity>
      </View>

      <View
        className="flex-row items-center rounded-xl border px-3 mb-3"
        style={{ borderColor: colors.border }}
      >
        <Search size={16} color={colors.textSecondary} />
        <TextInput
          value={filter}
          onChangeText={setFilter}
          placeholder="Cari percakapan..."
          placeholderTextColor={colors.textSecondary}
          className="flex-1 py-2.5 px-2 text-sm"
          style={{ color: colors.text }}
        />
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-sm" style={{ color: colors.textSecondary }}>
            Gagal memuat.
          </Text>
          <TouchableOpacity
            onPress={onRetry}
            className="mt-3 px-5 py-2.5 rounded-xl border"
            style={{ borderColor: colors.border }}
          >
            <Text className="text-xs font-semibold" style={{ color: colors.primary }}>
              Coba lagi
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(c) => c.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center py-16">
              <MessageCircle size={32} color={colors.textSecondary} />
              <Text className="mt-2 text-sm font-medium" style={{ color: colors.text }}>
                Belum ada percakapan
              </Text>
            </View>
          }
          renderItem={({ item: c }) => (
            <TouchableOpacity
              onPress={() => onOpenConversation(c.id)}
              className="flex-row items-center py-3 border-b"
              style={{ borderColor: colors.border }}
            >
              <View
                className="w-11 h-11 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.primary + '20' }}
              >
                <Text className="text-sm font-bold" style={{ color: colors.primary }}>
                  {c.initials}
                </Text>
              </View>
              <View className="ml-3 flex-1">
                <View className="flex-row items-center">
                  <Text
                    className="text-sm font-semibold flex-1"
                    style={{ color: colors.text }}
                    numberOfLines={1}
                  >
                    {c.displayName}
                  </Text>
                  {c.memberSuffix ? (
                    <Text className="text-[10px] ml-2" style={{ color: colors.textSecondary }}>
                      {c.memberSuffix}
                    </Text>
                  ) : null}
                </View>
                <View className="flex-row items-center justify-between">
                  <Text
                    className="text-xs flex-1"
                    style={{ color: colors.textSecondary }}
                    numberOfLines={1}
                  >
                    {c.preview}
                  </Text>
                  <Text className="text-[10px] ml-2" style={{ color: colors.textSecondary }}>
                    {c.timeLabel}
                  </Text>
                </View>
              </View>
              {c.unreadLabel ? (
                <View
                  className="min-w-5 h-5 rounded-full items-center justify-center px-1.5 ml-2"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Text className="text-[10px] font-bold text-white">{c.unreadLabel}</Text>
                </View>
              ) : null}
            </TouchableOpacity>
          )}
        />
      )}

      <Modal
        visible={showNew}
        animationType="slide"
        transparent
        onRequestClose={() => setShowNew(false)}
      >
        <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <View className="rounded-t-3xl p-5 max-h-[75%]" style={{ backgroundColor: colors.card }}>
            <Text className="text-base font-bold mb-1" style={{ color: colors.text }}>
              Chat baru
            </Text>
            <TextInput
              value={userQuery}
              onChangeText={setUserQuery}
              placeholder="Cari nama..."
              placeholderTextColor={colors.textSecondary}
              className="border rounded-xl px-3 py-2.5 mt-2 text-sm"
              style={{ borderColor: colors.border, color: colors.text }}
            />
            {isSearching ? <ActivityIndicator color={colors.primary} /> : null}
            <FlatList
              data={users}
              keyExtractor={(u) => u.id}
              renderItem={({ item: u }) => (
                <TouchableOpacity
                  onPress={() => onStartDirect(u.id)}
                  disabled={openDirectPending}
                  className="flex-row items-center py-2.5"
                >
                  <View
                    className="w-9 h-9 rounded-full items-center justify-center"
                    style={{ backgroundColor: colors.primary + '20' }}
                  >
                    <Text className="text-xs font-bold" style={{ color: colors.primary }}>
                      {u.initials}
                    </Text>
                  </View>
                  <View className="ml-3">
                    <Text className="text-sm font-medium" style={{ color: colors.text }}>
                      {u.fullName}
                    </Text>
                    <Text className="text-xs" style={{ color: colors.textSecondary }}>
                      {u.email}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setShowNew(false)} className="items-center mt-3 py-2">
              <Text className="text-xs" style={{ color: colors.textSecondary }}>
                Tutup
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showGroup}
        animationType="slide"
        transparent
        onRequestClose={() => setShowGroup(false)}
      >
        <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <View className="rounded-t-3xl p-5 max-h-[80%]" style={{ backgroundColor: colors.card }}>
            <Text className="text-base font-bold mb-1" style={{ color: colors.text }}>
              Grup baru
            </Text>
            <TextInput
              value={groupName}
              onChangeText={setGroupName}
              placeholder="Nama grup"
              placeholderTextColor={colors.textSecondary}
              maxLength={100}
              className="border rounded-xl px-3 py-2.5 mt-2 text-sm"
              style={{ borderColor: colors.border, color: colors.text }}
            />
            <FlatList
              data={users}
              keyExtractor={(u) => u.id}
              renderItem={({ item: u }) => {
                const on = picked.includes(u.id);
                return (
                  <TouchableOpacity
                    onPress={() => onTogglePick(u.id)}
                    className="flex-row items-center py-2.5"
                  >
                    <View
                      className="w-5 h-5 rounded-md border items-center justify-center"
                      style={{
                        borderColor: colors.border,
                        backgroundColor: on ? colors.primary : 'transparent',
                      }}
                    >
                      {on ? <Text className="text-[10px] font-bold text-white">✓</Text> : null}
                    </View>
                    <Text className="ml-3 text-sm" style={{ color: colors.text }}>
                      {u.fullName}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
            <TouchableOpacity
              onPress={onSubmitGroup}
              disabled={!groupName.trim() || pickedCount === 0 || createGroupPending}
              className="items-center py-3 rounded-xl mt-2"
              style={{
                backgroundColor: colors.primary,
                opacity: !groupName.trim() || pickedCount === 0 ? 0.5 : 1,
              }}
            >
              <Text className="text-sm font-semibold" style={{ color: colors.primaryForeground }}>
                {createGroupPending ? 'Membuat...' : `Buat grup (${pickedCount})`}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowGroup(false)}
              className="items-center mt-2 py-2"
            >
              <Text className="text-xs" style={{ color: colors.textSecondary }}>
                Tutup
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
