import { StatusBar } from 'expo-status-bar';
import { Mail, Plus, Trash2, UserCheck, Users } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import { useInvitation } from '@/hooks/service/Invitation/useInvitation';
import { useMember } from '@/hooks/service/Member/useMember';
import { useAppSelector } from '@/hooks/toolkit/redux';

export function MobileMembersContainer() {
  const { colors, isDark } = useTheme();
  const currentUser = useAppSelector((state) => state.auth.currentUser?.user);
  const isOwner = currentUser?.companyRole?.toLowerCase() === 'owner';

  const { query, mutate: memberMutate } = useMember();
  const { mutate: inviteMutate } = useInvitation();

  const { data: members = [], isLoading, isError, refetch, isFetching } = query.list();
  const deleteMember = memberMutate.delete();
  const createInvite = inviteMutate.create();

  const [modalVisible, setModalVisible] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  const handleInvite = () => {
    if (!inviteEmail.trim() || !inviteEmail.includes('@')) {
      Alert.alert('Validasi', 'Masukkan alamat email yang valid.');
      return;
    }

    createInvite.mutate(
      { email: inviteEmail.trim() },
      {
        onSuccess: () => {
          setInviteEmail('');
          setModalVisible(false);
          Alert.alert('Berhasil', 'Undangan telah dikirim ke ' + inviteEmail.trim());
          void refetch();
        },
        onError: (err: any) => {
          Alert.alert('Gagal', err?.message || 'Gagal mengirim undangan.');
        },
      },
    );
  };

  const handleDeleteMember = (id: string, name: string) => {
    Alert.alert(
      'Hapus Anggota',
      `Apakah Anda yakin ingin menghapus ${name || 'anggota ini'} dari perusahaan?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => {
            deleteMember.mutate({ id } as any, {
              onSuccess: () => {
                Alert.alert('Berhasil', 'Anggota telah dihapus.');
                void refetch();
              },
              onError: (err: any) => {
                Alert.alert('Gagal', err?.message || 'Gagal menghapus anggota.');
              },
            });
          },
        },
      ],
    );
  };

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
            onPress={() => setModalVisible(true)}
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
              onPress={() => refetch()}
              className="px-4 py-2 rounded-lg"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-primary-foreground text-xs font-semibold">Coba lagi</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={members as any[]}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl
                refreshing={isFetching && !isLoading}
                onRefresh={() => refetch()}
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
                        <View className="flex-row items-center gap-2 mt-1.5">
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
                        </View>
                      </View>
                    </View>

                    {!isSelf ? (
                      <TouchableOpacity
                        onPress={() => handleDeleteMember(item.id, memberName)}
                        disabled={deleteMember.isPending}
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
                  onPress={handleInvite}
                  disabled={createInvite.isPending}
                  className="px-4 py-2 rounded-lg"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Text className="text-primary-foreground font-semibold text-xs">
                    {createInvite.isPending ? 'Mengirim...' : 'Kirim Undangan'}
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
