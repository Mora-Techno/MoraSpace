import type { WorkspaceItem, WorkspaceType } from '@repo/types';
import { Building2, Check, ChevronDown, ChevronUp, User } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { useTheme } from '@/core/providers/theme.provinder';

interface WorkspaceSwitcherProps {
  service: {
    companies: WorkspaceItem[];
    activeType?: WorkspaceType;
    isLoading: boolean;
    isPending: boolean;
    onSelect: (workspaceId: string) => void;
  };
  state: {
    activeCompanyId: string | null;
  };
}

export function WorkspaceSwitcher({ service, state }: WorkspaceSwitcherProps) {
  const { colors } = useTheme();
  const { companies, activeType, isLoading, isPending, onSelect } = service;
  const { activeCompanyId } = state;

  const [expanded, setExpanded] = useState(false);

  const isPersonal = !activeCompanyId || activeType === 'personal';
  const activeCompany = companies.find((c) => c.id === activeCompanyId) ?? null;
  const currentName = isPersonal ? 'Personal Workspace' : (activeCompany?.name ?? 'Company');
  const currentRole = isPersonal ? 'Individual' : (activeCompany?.role ?? 'Member');

  const handleSelect = (workspaceId: string) => {
    if (isPending) return;
    if (workspaceId === 'personal' ? isPersonal : workspaceId === activeCompanyId) {
      setExpanded(false);
      return;
    }
    onSelect(workspaceId);
    setExpanded(false);
  };

  return (
    <View
      className="mx-4 mb-2 rounded-xl border"
      style={{ borderColor: colors.border, backgroundColor: colors.card }}
    >
      <TouchableOpacity
        onPress={() => setExpanded((v) => !v)}
        className="flex-row items-center p-3"
        disabled={isPending}
      >
        <View
          className="w-9 h-9 rounded-lg items-center justify-center"
          style={{ backgroundColor: colors.primary + '20' }}
        >
          {isPending ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : isPersonal ? (
            <User size={18} color={colors.primary} />
          ) : (
            <Building2 size={18} color={colors.primary} />
          )}
        </View>
        <View className="ml-3 flex-1">
          <Text className="text-sm font-semibold" style={{ color: colors.text }} numberOfLines={1}>
            {currentName}
          </Text>
          <Text className="text-[11px]" style={{ color: colors.textSecondary }}>
            {currentRole}
          </Text>
        </View>
        {expanded ? (
          <ChevronUp size={18} color={colors.textSecondary} />
        ) : (
          <ChevronDown size={18} color={colors.textSecondary} />
        )}
      </TouchableOpacity>

      {expanded && (
        <View className="border-t px-2 py-1" style={{ borderColor: colors.border }}>
          <TouchableOpacity
            onPress={() => handleSelect('personal')}
            className="flex-row items-center px-2 py-2.5 rounded-lg"
          >
            <User size={16} color={colors.textSecondary} />
            <View className="ml-2.5 flex-1">
              <Text className="text-xs font-medium" style={{ color: colors.text }}>
                Personal Workspace
              </Text>
              <Text className="text-[10px]" style={{ color: colors.textSecondary }}>
                Tugas & catatan pribadi
              </Text>
            </View>
            {isPersonal && <Check size={16} color={colors.primary} />}
          </TouchableOpacity>

          {companies.map((company) => {
            const active = !isPersonal && company.id === activeCompanyId;
            return (
              <TouchableOpacity
                key={company.id}
                onPress={() => handleSelect(company.id)}
                className="flex-row items-center px-2 py-2.5 rounded-lg"
              >
                <Building2 size={16} color={colors.textSecondary} />
                <View className="ml-2.5 flex-1">
                  <Text
                    className="text-xs font-medium"
                    style={{ color: colors.text }}
                    numberOfLines={1}
                  >
                    {company.name}
                  </Text>
                  <Text className="text-[10px]" style={{ color: colors.textSecondary }}>
                    Role: {company.role}
                  </Text>
                </View>
                {active && <Check size={16} color={colors.primary} />}
              </TouchableOpacity>
            );
          })}

          {isLoading && (
            <View className="items-center py-2">
              <ActivityIndicator size="small" color={colors.textSecondary} />
            </View>
          )}
        </View>
      )}
    </View>
  );
}
