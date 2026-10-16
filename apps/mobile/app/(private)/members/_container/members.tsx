import { useMemo, useState } from 'react';
import { Alert } from 'react-native';

import { MembersSection } from '@/components/section/private/members/members.section';
import { useInvitation } from '@/hooks/service/Invitation/useInvitation';
import { useMember } from '@/hooks/service/Member/useMember';
import { useApi } from '@/hooks/service/useApi';
import { useAppSelector } from '@/hooks/toolkit/redux';

export function MobileMembersContainer() {
  const currentUser = useAppSelector((state) => state.auth.currentUser?.user);
  const isOwner = currentUser?.companyRole?.toLowerCase() === 'owner';

  const api = useApi();
  const { query, mutate: memberMutate } = useMember();
  const { mutate: inviteMutate } = useInvitation();

  const { data: members = [], isLoading, isError, refetch, isFetching } = query.list();
  const { data: rawStatuses = [] } = api.workingHours.query.memberStatus();

  const statusMap = useMemo(() => {
    const map = new Map<string, any>();
    const list = Array.isArray(rawStatuses) ? rawStatuses : [rawStatuses];
    for (const s of list) {
      if (!s) continue;
      if (s.companyMemberId) map.set(s.companyMemberId, s);
      if (s.userId) map.set(s.userId, s);
    }
    return map;
  }, [rawStatuses]);
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

  return (
    <MembersSection
      service={{
        isOwner,
        currentUser,
        members: members as any[],
        statusMap,
        isLoading,
        isError,
        isFetching,
        deletePending: deleteMember.isPending,
        invitePending: createInvite.isPending,
        onRetry: () => refetch(),
        onInviteOpen: () => setModalVisible(true),
        onDelete: handleDeleteMember,
        onSubmitInvite: handleInvite,
      }}
      state={{
        modalVisible,
        setModalVisible,
        inviteEmail,
        setInviteEmail,
      }}
    />
  );
}
