import type { WorkingStatus } from '@repo/types';
import { Clock } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import { useTheme } from '@/core/providers/theme.provinder';
import { cn } from '@/lib/utils';

export interface WorkingStatusBadgeProps {
  status?: WorkingStatus;
  statusLabel?: string;
  className?: string;
  compact?: boolean;
}

export function WorkingStatusBadge({
  status = 'working',
  statusLabel,
  className,
  compact = false,
}: WorkingStatusBadgeProps) {
  const { colors, isDark } = useTheme();
  const isWorking = status === 'working';
  const label = statusLabel || (isWorking ? 'Sedang kerja' : 'Di luar jam kerja');

  if (isWorking) {
    return (
      <View
        className={cn(
          'flex-row items-center gap-1.5 px-2 py-0.5 rounded-full border',
          compact && 'px-1.5 py-0',
          className,
        )}
        style={{
          backgroundColor: '#10b98115',
          borderColor: '#10b98135',
        }}
      >
        <View className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        <Text
          className={cn('text-[11px] font-semibold text-emerald-600', compact && 'text-[10px]')}
          style={{ color: isDark ? '#34d399' : '#059669' }}
        >
          {compact ? 'Aktif' : label}
        </Text>
      </View>
    );
  }

  return (
    <View
      className={cn(
        'flex-row items-center gap-1 px-2 py-0.5 rounded-full border',
        compact && 'px-1.5 py-0',
        className,
      )}
      style={{
        backgroundColor: colors.card,
        borderColor: isDark ? colors.border : '#e5e7eb',
      }}
    >
      <Clock size={10} color={isDark ? '#9ca3af' : '#6b7280'} />
      <Text
        className={cn('text-[11px] font-medium text-gray-500', compact && 'text-[10px]')}
        style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

export default WorkingStatusBadge;
