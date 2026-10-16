import { StatusBar } from 'expo-status-bar';
import { Plus, Trash2, UserCheck, Users } from 'lucide-react-native';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { WorkingStatusBadge } from '@/components/ui/working-status-badge';
import { useTheme } from '@/core/providers/theme.provinder';

interface MembersSectionProps {
  service: {
    isOwner: boolean;
    currentUser: any;
    members: any[];
    statusMap: Map<string, any>;
    isLoading: boolean;
    isError: boolean;
    isFetching: boolean;
    deletePending: boolean;
    invitePending: boolean;
    onRetry: () => void;
    onInviteOpen: () => void;
    onDelete: (id: string, name: string) => void;
    onSubmitInvite: () => void;
  };
  state: {
    modalVisible: boolean;
    setModalVisible: (v: boolean) => void;
    inviteEmail: string;
    setInviteEmail: (v: string) => void;
  };
}

export function MembersSection({ service, state }: MembersSectionProps) {
  const { colors, isDark } = useTheme();
  const {
    isOwner,
    currentUser,
    members,
    statusMap,
    isLoading,
    isError,
    isFetching,
    deletePending,
    invitePending,
    onRetry,
    onInviteOpen,
    onDelete,
    onSubmitInvite,
  } = service;
  const { modalVisible, setModalVisible, inviteEmail, setInviteEmail } = state;

  if (!isOwner) {
    return (
      <SafeAreaView
        edges={['top', 'bottom']}
        style={{ flex: 1, backgroundColor: colors.background }}
      >
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-base font-bold text-center" style={{ color: colors.text }}>
            Akses Terbatas
          </Text>
          <Text className="text-xs text-gray-500 text-center mt-2">
            Halaman manajemen anggota hanya dapat diakses oleh peran Owner perusahaan.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View className="flex-1 p-4" style={{ backgroundColor: colors.background }}>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-xl font-bold" style={{ color: colors.text }}>
              Anggota Tim
            </Text>
            <Text className="text-xs text-gray-500">Kelola dan undang anggota perusahaan</Text>
          </View>
          <TouchableOpacity
            onPress={onInviteOpen}
            className="flex-row items-center px-3.5 py-2 rounded-xl"
            style={{ backgroundColor: colors.primary }}
          >
            <Plus size={16} color={colors.primaryForeground} />
            <Text className="text-primary-foreground text-xs font-semibold ml-1.5">Undang</Text>
          </TouchableOpacity>
        </View>

        {/* Member List */}
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : isError ? (
          <View className="flex-1 items-center justify-center gap-2">
            <Text className="text-sm" style={{ color: colors.text }}>
              Gagal memuat daftar anggota.
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
            data={members}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl
                refreshing={isFetching && !isLoading}
                onRefresh={onRetry}
                tintColor={colors.primary}
              />
            }
            renderItem={({ item }) => {
              const memberName = item.user?.fullName || item.fullName || 'Anggota';
              const memberEmail = item.user?.email || item.email || '';
              const roleName =
                item.role?.name || item.roleName || (item.isOwner ? 'Owner' : 'Member');
              const isSelf =
                item.userId === currentUser?.id || item.id === currentUser?.companyMemberId;

              return (
                <View
                  className="p-4 mb-3 rounded-2xl border"
                  style={{
                    backgroundColor: colors.card,
                    borderColor: isDark ? colors.border : '#e5e7eb',
                  }}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1 mr-3">
                      <View
                        className="w-10 h-10 rounded-full items-center justify-center"
                        style={{ backgroundColor: colors.primary + '15' }}
                      >
                        <UserCheck size={20} color={colors.primary} />
                      </View>
                      <View className="ml-3 flex-1">
                        <Text className="text-sm font-bold" style={{ color: colors.text }}>
                          {memberName}
                          {isSelf ? ' (Anda)' : ''}
                        </Text>
                        <Text className="text-xs text-gray-500 mt-0.5">{memberEmail}</Text>
                        <View className="flex-row items-center gap-2 mt-1.5 flex-wrap">
                          <View
                            className="px-2 py-0.5 rounded-md"
                            style={{ backgroundColor: colors.primary + '15' }}
                          >
                            <Text
                              className="text-[10px] font-semibold"
                              style={{ color: colors.primary }}
                            >
                              {roleName}
                            </Text>
                          </View>
                          {(() => {
                            const s = statusMap.get(item.id) || statusMap.get(item.userId);
                            return s ? (
                              <WorkingStatusBadge
                                status={s.status}
                                statusLabel={s.statusLabel}
                                compact
                              />
                            ) : null;
                          })()}
                        </View>
                      </View>
                    </View>

                    {!isSelf ? (
                      <TouchableOpacity
                        onPress={() => onDelete(item.id, memberName)}
                        disabled={deletePending}
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: '#ef444415' }}
                      >
                        <Trash2 size={16} color="#ef4444" />
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>
              );
            }}
            ListEmptyComponent={
              <View className="items-center justify-center py-20">
                <Users size={32} color={colors.textSecondary} />
                <Text className="text-xs text-gray-400 mt-2">Belum ada anggota terdaftar.</Text>
              </View>
            }
          />
        )}

        {/* Modal Invite Member */}
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
              <Text className="text-base font-bold mb-1" style={{ color: colors.text }}>
                Undang Anggota Baru
              </Text>
              <Text className="text-xs text-gray-500 mb-4">
                Kirimkan email undangan bergabung ke tim perusahaan Anda.
              </Text>

              <TextInput
                value={inviteEmail}
                onChangeText={setInviteEmail}
                placeholder="nama@perusahaan.com"
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="none"
                keyboardType="email-address"
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
                  onPress={onSubmitInvite}
                  disabled={invitePending}
                  className="px-4 py-2 rounded-lg"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Text className="text-primary-foreground font-semibold text-xs">
                    {invitePending ? 'Mengirim...' : 'Kirim Undangan'}
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
