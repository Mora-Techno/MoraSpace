import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Text } from '@/components/ui/text';
import { useTheme } from '@/core/providers/theme.provinder';

export type RegisterMode = 'individual' | 'company';

interface RegisterSectionProps {
  service: {
    isPending: boolean;
    onSubmit: () => void;
  };
  state: {
    mode: RegisterMode;
    setMode: (m: RegisterMode) => void;
    companyName: string;
    setCompanyName: (v: string) => void;
    fullName: string;
    setFullName: (v: string) => void;
    email: string;
    setEmail: (v: string) => void;
    password: string;
    setPassword: (v: string) => void;
  };
}

export function RegisterSection({ service, state }: RegisterSectionProps) {
  const { colors } = useTheme();
  const { isPending, onSubmit } = service;
  const {
    mode,
    setMode,
    companyName,
    setCompanyName,
    fullName,
    setFullName,
    email,
    setEmail,
    password,
    setPassword,
  } = state;

  const inputCls =
    'w-full rounded-xl border bg-muted/40 px-3.5 py-3 text-sm text-foreground outline-none';
  const labelCls = 'text-sm font-medium text-foreground block';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView
        className="flex-1 px-6 pt-10"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-2xl font-bold tracking-tight" style={{ color: colors.text }}>
          Buat Akun Spaces
        </Text>
        <Text className="mt-1 text-sm" style={{ color: colors.textSecondary }}>
          Personal untuk diri sendiri, Company untuk tim.
        </Text>

        <View
          className="mt-5 flex-row rounded-xl border p-1"
          style={{ borderColor: colors.border }}
        >
          {(['individual', 'company'] as RegisterMode[]).map((m) => (
            <TouchableOpacity
              key={m}
              onPress={() => setMode(m)}
              className="flex-1 items-center rounded-lg py-2.5"
              style={mode === m ? { backgroundColor: colors.primary } : undefined}
            >
              <Text
                className="text-xs font-semibold"
                style={{ color: mode === m ? colors.primaryForeground : colors.textSecondary }}
              >
                {m === 'individual' ? 'Personal' : 'Company'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="mt-5 space-y-4">
          {mode === 'company' && (
            <View>
              <Text className={labelCls}>Nama Company</Text>
              <TextInput
                value={companyName}
                onChangeText={setCompanyName}
                placeholder="PT Maju Bersama"
                placeholderTextColor={colors.textSecondary}
                className={inputCls}
                style={{ borderColor: colors.border, color: colors.text }}
              />
            </View>
          )}
          <View>
            <Text className={labelCls}>Nama Lengkap</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Nama Anda"
              placeholderTextColor={colors.textSecondary}
              className={inputCls}
              style={{ borderColor: colors.border, color: colors.text }}
            />
          </View>
          <View>
            <Text className={labelCls}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="nama@perusahaan.com"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              className={inputCls}
              style={{ borderColor: colors.border, color: colors.text }}
            />
          </View>
          <View>
            <Text className={labelCls}>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Buat password aman"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
              className={inputCls}
              style={{ borderColor: colors.border, color: colors.text }}
            />
          </View>

          <TouchableOpacity
            onPress={onSubmit}
            disabled={isPending}
            className="w-full items-center justify-center py-3.5 px-4 rounded-xl mt-2 active:opacity-90"
            style={{ backgroundColor: colors.primary, opacity: isPending ? 0.6 : 1 }}
          >
            <Text className="font-semibold text-sm" style={{ color: colors.primaryForeground }}>
              {isPending ? 'Memproses...' : mode === 'company' ? 'Buat Company' : 'Daftar Personal'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
