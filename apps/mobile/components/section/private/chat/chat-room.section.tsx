import type { ChatMemberInfo, ChatUserSearchResult, WorkingStatus } from '@repo/types';
import { ArrowLeft, Check, CheckCheck, Clock, Send, Users, Zap } from 'lucide-react-native';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Text } from '@/components/ui/text';
import { WorkingStatusBadge } from '@/components/ui/working-status-badge';
import { useTheme } from '@/core/providers/theme.provinder';
import type { ChatConnStatus, LocalChatMessage } from '@/hooks/useChatSocket';

function initials(name?: string | null) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function fmtTime(iso?: string | null) {
  if (!iso) return '';
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

interface ChatRoomSectionProps {
  service: {
    title: string;
    isGroup: boolean;
    memberCount: number;
    groupNameDisplay: string;
    status: ChatConnStatus;
    userId: string | null;
    peerStatus: { status: WorkingStatus; statusLabel: string } | null;
    messages: LocalChatMessage[];
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    isLoading: boolean;
    isError: boolean;
    typers: { userId: string; fullName?: string }[];
    peerReadSeq: number | null;
    urgentQuota: { remainingToday: number; dailyLimit: number } | null;
    isUrgent: boolean;
    newCount: number;
    members: ChatMemberInfo[];
    availableCandidates: ChatUserSearchResult[];
    canManage: boolean;
    isOwner: boolean;
    updateGroupPending: boolean;
    addMemberPending: boolean;
    setMemberRolePending: boolean;
    removeMemberPending: boolean;
    transferPending: boolean;
    leavePending: boolean;
    onBack: () => void;
    onOpenInfo: () => void;
    onCloseInfo: () => void;
    onEndReached: () => void;
    onInput: (v: string) => void;
    onSend: () => void;
    onBlurStop: () => void;
    onRetryMessage: (clientMessageId: string) => void;
    onToggleUrgent: () => void;
    onSaveGroup: () => void;
    onAddMember: (userId: string) => void;
    onSetRole: (userId: string, toAdmin: boolean) => void;
    onRemoveMember: (userId: string) => void;
    onTransfer: (userId: string) => void;
    onLeave: () => void;
  };
  state: {
    draft: string;
    setDraft: (v: string) => void;
    showInfo: boolean;
    setShowInfo: (v: boolean) => void;
    editName: string;
    setEditName: (v: string) => void;
    addQuery: string;
    setAddQuery: (v: string) => void;
  };
}

export function ChatRoomSection({ service, state }: ChatRoomSectionProps) {
  const { colors } = useTheme();
  const {
    title,
    isGroup,
    memberCount,
    groupNameDisplay,
    status,
    userId,
    peerStatus,
    messages,
    isFetchingNextPage,
    isLoading,
    isError,
    typers,
    peerReadSeq,
    urgentQuota,
    isUrgent,
    members,
    availableCandidates,
    canManage,
    isOwner,
    updateGroupPending,
    addMemberPending,
    setMemberRolePending,
    removeMemberPending,
    transferPending,
    leavePending,
    onBack,
    onOpenInfo,
    onCloseInfo,
    onEndReached,
    onInput,
    onSend,
    onBlurStop,
    onRetryMessage,
    onToggleUrgent,
    onSaveGroup,
    onAddMember,
    onSetRole,
    onRemoveMember,
    onTransfer,
    onLeave,
  } = service;
  const { draft, showInfo, editName, setEditName, addQuery, setAddQuery } = state;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      <View
        className="flex-row items-center px-2 py-2 border-b"
        style={{ borderColor: colors.border }}
      >
        <TouchableOpacity onPress={onBack} className="p-2">
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <View
          className="w-9 h-9 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.primary + '20' }}
        >
          <Text className="text-xs font-bold" style={{ color: colors.primary }}>
            {initials(title)}
          </Text>
        </View>
        <View className="ml-2 flex-1">
          <View className="flex-row items-center gap-2">
            <Text
              className="text-sm font-semibold"
              style={{ color: colors.text }}
              numberOfLines={1}
            >
              {title}
            </Text>
            {!isGroup && peerStatus ? (
              <WorkingStatusBadge
                status={peerStatus.status}
                statusLabel={peerStatus.statusLabel}
                compact
              />
            ) : null}
          </View>
          <Text className="text-[11px]" style={{ color: colors.textSecondary }} numberOfLines={1}>
            {typers.length > 0
              ? `${typers.map((t) => t.fullName || 'Seseorang').join(', ')} mengetik...`
              : isGroup
                ? `${memberCount} anggota`
                : status === 'open'
                  ? 'Terhubung'
                  : 'Menghubungkan...'}
          </Text>
        </View>
        {isGroup && (
          <TouchableOpacity onPress={onOpenInfo} className="p-2">
            <Users size={20} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-sm text-center" style={{ color: colors.text }}>
            Tidak dapat membuka percakapan.
          </Text>
          <Text className="text-xs text-center mt-1" style={{ color: colors.textSecondary }}>
            Mungkin sudah keluar atau akses dicabut.
          </Text>
        </View>
      ) : (
        <FlatList
          inverted
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 8 }}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            isFetchingNextPage ? <ActivityIndicator color={colors.primary} /> : null
          }
          ListEmptyComponent={
            <View className="items-center py-10">
              <Text className="text-xs" style={{ color: colors.textSecondary }}>
                Belum ada pesan.
              </Text>
            </View>
          }
          renderItem={({ item: m }) => {
            const mine = m.senderId === userId;
            const failed = m.sendStatus === 'failed';
            const sending = m.sendStatus === 'sending';
            const read =
              mine &&
              !sending &&
              !failed &&
              peerReadSeq != null &&
              peerReadSeq >= m.seq &&
              m.seq > 0;
            return (
              <View className={`my-0.5 ${mine ? 'items-end' : 'items-start'}`}>
                {!mine && isGroup ? (
                  <Text className="text-[10px] mb-0.5 ml-1" style={{ color: colors.textSecondary }}>
                    {m.senderName || 'Anggota'}
                  </Text>
                ) : null}
                <View
                  className="max-w-[80%] rounded-2xl px-3 py-1.5"
                  style={
                    mine
                      ? { backgroundColor: failed ? colors.card : colors.primary }
                      : { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }
                  }
                >
                  <Text
                    className="text-sm"
                    style={{ color: mine && !failed ? colors.primaryForeground : colors.text }}
                  >
                    {m.body}
                  </Text>
                </View>
                <View className="flex-row items-center mt-0.5 px-1 flex-wrap gap-1">
                  {m.isHeld ? (
                    <View
                      className="flex-row items-center gap-0.5 px-1 py-0.2 rounded"
                      style={{ backgroundColor: '#f59e0b20' }}
                    >
                      <Clock size={10} color="#d97706" />
                      <Text className="text-[9px] font-medium" style={{ color: '#d97706' }}>
                        Akan sampai jam kerja
                      </Text>
                    </View>
                  ) : null}
                  {m.isUrgent ? (
                    <View
                      className="flex-row items-center gap-0.5 px-1 py-0.2 rounded"
                      style={{ backgroundColor: '#f43f5e20' }}
                    >
                      <Zap size={9} color="#e11d48" />
                      <Text className="text-[9px] font-bold" style={{ color: '#e11d48' }}>
                        Mendesak
                      </Text>
                    </View>
                  ) : null}
                  <Text className="text-[10px]" style={{ color: colors.textSecondary }}>
                    {fmtTime(m.createdAt)}
                  </Text>
                  {sending ? (
                    <Text className="text-[10px] ml-1" style={{ color: colors.textSecondary }}>
                      …
                    </Text>
                  ) : null}
                  {failed ? (
                    <TouchableOpacity onPress={() => onRetryMessage(m.clientMessageId)}>
                      <Text className="text-[10px] ml-1 font-semibold" style={{ color: '#ef4444' }}>
                        Gagal, ulangi
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                  {!sending && !failed && mine && !m.isHeld && m.seq > 0 ? (
                    read ? (
                      <CheckCheck size={13} color="#38bdf8" />
                    ) : (
                      <Check size={13} color={colors.textSecondary} />
                    )
                  ) : null}
                </View>
              </View>
            );
          }}
        />
      )}

      {!isGroup && peerStatus?.status === 'out_of_hours' ? (
        <View
          className="flex-row items-center justify-between px-3 py-1.5 border-t"
          style={{ borderColor: colors.border, backgroundColor: colors.card }}
        >
          <View className="flex-row items-center flex-1 mr-2">
            <Clock size={12} color={colors.textSecondary} />
            <Text
              className="text-[11px] ml-1 flex-1"
              style={{ color: colors.textSecondary }}
              numberOfLines={1}
            >
              Rekan di luar jam kerja. Sampai{' '}
              <Text className="font-bold" style={{ color: colors.text }}>
                {peerStatus.statusLabel.replace(/^Kembali\s*/i, '')}
              </Text>
            </Text>
          </View>
          <TouchableOpacity
            onPress={onToggleUrgent}
            disabled={!!urgentQuota && urgentQuota.remainingToday <= 0 && !isUrgent}
            className="flex-row items-center px-2 py-1 rounded-full border"
            style={{
              backgroundColor: isUrgent ? '#d97706' : colors.card,
              borderColor: isUrgent ? '#d97706' : '#d9770660',
              opacity: urgentQuota && urgentQuota.remainingToday <= 0 && !isUrgent ? 0.4 : 1,
            }}
          >
            <Zap size={11} color={isUrgent ? '#ffffff' : '#d97706'} />
            <Text
              className="text-[10px] font-bold ml-1"
              style={{ color: isUrgent ? '#ffffff' : '#d97706' }}
            >
              {isUrgent
                ? 'Mendesak Aktif'
                : `Mendesak (${urgentQuota?.remainingToday ?? 3}/${urgentQuota?.dailyLimit ?? 3})`}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <View
        className="flex-row items-end px-3 py-2 border-t"
        style={{ borderColor: colors.border, backgroundColor: colors.background }}
      >
        <TextInput
          value={draft}
          onChangeText={onInput}
          onBlur={onBlurStop}
          placeholder={status === 'open' ? 'Tulis pesan...' : 'Menghubungkan...'}
          placeholderTextColor={colors.textSecondary}
          multiline
          editable={status === 'open'}
          className="flex-1 rounded-xl border px-3 py-2 text-sm max-h-28"
          style={{ borderColor: colors.border, color: colors.text }}
        />
        <TouchableOpacity
          onPress={onSend}
          disabled={!draft.trim() || status !== 'open'}
          className="ml-2 w-10 h-10 rounded-full items-center justify-center"
          style={{
            backgroundColor: colors.primary,
            opacity: !draft.trim() || status !== 'open' ? 0.5 : 1,
          }}
        >
          <Send size={18} color={colors.primaryForeground} />
        </TouchableOpacity>
      </View>

      <Modal visible={showInfo} animationType="slide" transparent onRequestClose={onCloseInfo}>
        <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <View className="rounded-t-3xl p-5 max-h-[85%]" style={{ backgroundColor: colors.card }}>
            <Text className="text-base font-bold" style={{ color: colors.text }}>
              Info grup
            </Text>
            {canManage ? (
              <View className="mt-2">
                <Text className="text-xs mb-1" style={{ color: colors.textSecondary }}>
                  Nama grup
                </Text>
                <View className="flex-row gap-2">
                  <TextInput
                    value={editName}
                    onChangeText={setEditName}
                    maxLength={100}
                    className="flex-1 border rounded-xl px-3 py-2 text-sm"
                    style={{ borderColor: colors.border, color: colors.text }}
                  />
                  <TouchableOpacity
                    onPress={onSaveGroup}
                    disabled={updateGroupPending}
                    className="px-4 justify-center rounded-xl"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Text
                      className="text-xs font-semibold"
                      style={{ color: colors.primaryForeground }}
                    >
                      Simpan
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <Text className="text-sm mt-2" style={{ color: colors.text }}>
                {groupNameDisplay}
              </Text>
            )}
            <Text
              className="text-xs font-semibold mt-4 mb-1"
              style={{ color: colors.textSecondary }}
            >
              ANGGOTA ({memberCount})
            </Text>
            {members.map((m) => (
              <View key={m.id} className="flex-row items-center py-2">
                <View
                  className="w-8 h-8 rounded-full items-center justify-center"
                  style={{ backgroundColor: colors.primary + '20' }}
                >
                  <Text className="text-[10px] font-bold" style={{ color: colors.primary }}>
                    {initials(m.user?.fullName)}
                  </Text>
                </View>
                <View className="ml-2 flex-1">
                  <Text
                    className="text-xs font-medium"
                    style={{ color: colors.text }}
                    numberOfLines={1}
                  >
                    {m.user?.fullName}
                    {m.userId === userId ? ' (Saya)' : ''}
                  </Text>
                  <Text className="text-[10px]" style={{ color: colors.textSecondary }}>
                    {m.role}
                  </Text>
                </View>
                {isOwner && m.userId !== userId ? (
                  <TouchableOpacity
                    onPress={() => onSetRole(m.userId, m.role !== 'ADMIN')}
                    disabled={setMemberRolePending}
                    className="px-2 py-1"
                  >
                    <Text className="text-[11px]" style={{ color: colors.primary }}>
                      {m.role === 'ADMIN' ? 'Turunkan' : 'Angkat'}
                    </Text>
                  </TouchableOpacity>
                ) : null}
                {isOwner && m.userId !== userId ? (
                  <TouchableOpacity
                    onPress={() => onTransfer(m.userId)}
                    disabled={transferPending}
                    className="px-2 py-1"
                  >
                    <Text className="text-[11px]" style={{ color: colors.primary }}>
                      Jadikan Owner
                    </Text>
                  </TouchableOpacity>
                ) : null}
                {canManage && m.userId !== userId && (isOwner || m.role === 'MEMBER') ? (
                  <TouchableOpacity
                    onPress={() => onRemoveMember(m.userId)}
                    disabled={removeMemberPending}
                    className="px-2 py-1"
                  >
                    <Text className="text-[11px]" style={{ color: '#ef4444' }}>
                      Keluarkan
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            ))}
            {canManage ? (
              <View className="mt-2">
                <Text className="text-xs mb-1" style={{ color: colors.textSecondary }}>
                  Tambah (cari nama)
                </Text>
                <TextInput
                  value={addQuery}
                  onChangeText={setAddQuery}
                  placeholder="Nama anggota..."
                  placeholderTextColor={colors.textSecondary}
                  className="border rounded-xl px-3 py-2 text-sm"
                  style={{ borderColor: colors.border, color: colors.text }}
                />
                {availableCandidates.map((u) => (
                  <TouchableOpacity
                    key={u.id}
                    onPress={() => onAddMember(u.id)}
                    disabled={addMemberPending}
                    className="flex-row items-center py-2"
                  >
                    <Text className="flex-1 text-xs" style={{ color: colors.text }}>
                      {u.fullName}
                    </Text>
                    <Text className="text-[11px] font-semibold" style={{ color: colors.primary }}>
                      Tambah
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : null}
            <TouchableOpacity
              onPress={onLeave}
              disabled={leavePending}
              className="mt-4 items-center py-2.5 rounded-xl"
              style={{ backgroundColor: '#ef444420' }}
            >
              <Text className="text-xs font-semibold" style={{ color: '#ef4444' }}>
                Keluar grup
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onCloseInfo} className="items-center mt-1 py-2">
              <Text className="text-xs" style={{ color: colors.textSecondary }}>
                Tutup
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
