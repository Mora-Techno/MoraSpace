import type { OwnerDashboardOverview } from '@repo/types';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';

import { Text } from '@/components/ui/text';
import { useTheme } from '@/core/providers/theme.provinder';

function Row({ label, value, colors }: { label: string; value: string; colors: any }) {
  return (
    <View className="flex-row items-center justify-between py-2">
      <Text className="text-xs" style={{ color: colors.textSecondary }}>
        {label}
      </Text>
      <Text className="text-sm font-semibold" style={{ color: colors.text }}>
        {value}
      </Text>
    </View>
  );
}

function Card({
  title,
  children,
  colors,
}: {
  title: string;
  children: React.ReactNode;
  colors: any;
}) {
  return (
    <View
      className="rounded-2xl border p-4 mb-3"
      style={{ borderColor: colors.border, backgroundColor: colors.card }}
    >
      <Text className="text-sm font-bold mb-1" style={{ color: colors.text }}>
        {title}
      </Text>
      {children}
    </View>
  );
}

interface OverviewSectionProps {
  service: {
    overview: OwnerDashboardOverview | undefined;
    isLoading: boolean;
    isError: boolean;
    isFetching: boolean;
    refreshing: boolean;
    deepWorkText: string;
    onRefresh: () => void;
    onRetry: () => void;
  };
}

export function OverviewSection({ service }: OverviewSectionProps) {
  const { colors } = useTheme();
  const {
    overview: data,
    isLoading,
    isError,
    isFetching,
    refreshing,
    deepWorkText,
    onRefresh,
    onRetry,
  } = service;

  if (isLoading) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View
        className="flex-1 items-center justify-center px-8"
        style={{ backgroundColor: colors.background }}
      >
        <Text className="text-sm font-medium text-center" style={{ color: colors.text }}>
          Gagal memuat ringkasan.
        </Text>
        <TouchableOpacity
          onPress={onRetry}
          className="mt-4 px-5 py-2.5 rounded-xl border"
          style={{ borderColor: colors.border }}
        >
          <Text className="text-xs font-semibold" style={{ color: colors.primary }}>
            Coba lagi
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 px-4 pt-4"
      style={{ backgroundColor: colors.background }}
      refreshControl={
        <RefreshControl refreshing={refreshing || isFetching} onRefresh={onRefresh} />
      }
    >
      <Text className="text-xl font-bold mb-1" style={{ color: colors.text }}>
        Ringkasan
      </Text>
      <Text className="text-xs mb-4" style={{ color: colors.textSecondary }}>
        Kondisi perusahaan terkini.
      </Text>

      <Card title="Anggota" colors={colors}>
        <Row
          label="Aktif"
          value={`${data.members.active} / ${data.members.maxMembers ?? '–'}`}
          colors={colors}
        />
        <Row label="Terdaftar" value={`${data.members.total}`} colors={colors} />
      </Card>

      <Card title="Tugas" colors={colors}>
        <Row label="Total" value={`${data.tasks.total}`} colors={colors} />
        <Row label="Aktif" value={`${data.tasks.active}`} colors={colors} />
        <Row label="Overdue" value={`${data.tasks.overdue}`} colors={colors} />
        <Row
          label="Selesai"
          value={`${data.tasks.completed} (${data.tasks.doneRate}%)`}
          colors={colors}
        />
        {data.tasks.byStatus.map((s) => (
          <Row key={s.name} label={s.name} value={`${s.count}`} colors={colors} />
        ))}
      </Card>

      <Card title="Deep Work (7 hari)" colors={colors}>
        <Row label="Total fokus" value={deepWorkText} colors={colors} />
      </Card>

      <Card title="Paket" colors={colors}>
        {data.plan ? (
          <>
            <Row label="Paket Aktif" value={data.plan.tier} colors={colors} />
            <Row label="Status" value={data.plan.status} colors={colors} />
          </>
        ) : (
          <Text className="text-xs" style={{ color: colors.textSecondary }}>
            Belum ada langganan.
          </Text>
        )}
      </Card>

      <Card title="Aktivitas Terbaru" colors={colors}>
        {data.recentActivity.length === 0 ? (
          <Text className="text-xs" style={{ color: colors.textSecondary }}>
            Belum ada aktivitas.
          </Text>
        ) : (
          data.recentActivity.map((a) => (
            <View key={a.id} className="py-2 border-b" style={{ borderColor: colors.border }}>
              <Text className="text-xs font-medium" style={{ color: colors.text }}>
                {a.actorName} <Text style={{ color: colors.textSecondary }}>{a.action}</Text>
              </Text>
              <Text
                className="text-[11px]"
                style={{ color: colors.textSecondary }}
                numberOfLines={1}
              >
                {a.taskTitle}
              </Text>
            </View>
          ))
        )}
      </Card>
      <View className="h-6" />
    </ScrollView>
  );
}
