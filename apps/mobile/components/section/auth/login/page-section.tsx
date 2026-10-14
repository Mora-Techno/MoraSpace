import { PickLogin } from '@repo/types';
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react-native';
import React from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Text } from '@/components/ui/text';
import { useTheme } from '@/core/providers/theme.provinder';
import { AlertContexType } from '@/types/ui';

interface LoginPageProps {
  state: {
    formLogin: PickLogin;
    setFormLogin: React.Dispatch<React.SetStateAction<PickLogin>>;
    showPassword: boolean;
    setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
    alert: AlertContexType;
  };
  service: {
    isPending: boolean;
    onLogin: () => void;
  };
}

export default function LoginPage({ state, service }: LoginPageProps) {
  const { colors, isDark } = useTheme();
  const { formLogin, setFormLogin, setShowPassword, showPassword, alert } = state;
  const { isPending, onLogin } = service;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      className="flex-1"
    >
      <ScrollView
        className="flex-1"
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="p-6 max-w-md w-full self-center">
          {/* Brand Header */}
          <View className="flex-row items-center gap-2.5 mb-6">
            <View
              className="size-8 rounded-xl items-center justify-center"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="font-bold text-sm" style={{ color: colors.primaryForeground }}>
                S
              </Text>
            </View>
            <Text className="text-xl font-bold tracking-tight" style={{ color: colors.text }}>
              Spaces
            </Text>
          </View>

          {/* Theme-Adaptive Illustration */}
          <View
            className="w-full aspect-[16/10] rounded-2xl overflow-hidden border mb-6 shadow-sm"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.card,
            }}
          >
            <Image
              source={
                isDark
                  ? require('@/assets/images/ilustrasion-dark.jpg')
                  : require('@/assets/images/ilustrasion-light.jpg')
              }
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>

          {/* Title & Subtitle */}
          <View className="mb-6">
            <Text className="text-2xl font-bold tracking-tight mb-1" style={{ color: colors.text }}>
              Selamat datang kembali
            </Text>
            <Text className="text-sm leading-5" style={{ color: colors.textSecondary }}>
              Masuk untuk melanjutkan ke ruang kerja Spaces Anda.
            </Text>
          </View>

          {/* Form Card */}
          <View
            className="rounded-2xl border p-5 space-y-4 shadow-sm"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
            }}
          >
            {/* Email Field */}
            <View className="space-y-1.5">
              <Text
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: colors.textSecondary }}
              >
                Email kerja
              </Text>
              <View
                className="flex-row items-center border rounded-xl px-3.5 py-1"
                style={{
                  borderColor: colors.border,
                  backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                }}
              >
                <Mail size={18} color={colors.textSecondary} />
                <TextInput
                  className="flex-1 py-3 px-2.5 text-sm"
                  style={{ color: colors.text }}
                  placeholder="nama@perusahaan.com"
                  placeholderTextColor={colors.textSecondary}
                  value={formLogin.email}
                  onChangeText={(e) =>
                    setFormLogin((prev) => ({
                      ...prev,
                      email: e,
                    }))
                  }
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
            </View>

            {/* Password Field */}
            <View className="space-y-1.5">
              <View className="flex-row items-center justify-between">
                <Text
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: colors.textSecondary }}
                >
                  Password
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    alert.toast({
                      title: 'Reset Password',
                      message: 'Silakan gunakan web app untuk mereset kata sandi Anda.',
                      icon: 'info',
                    })
                  }
                >
                  <Text className="text-xs font-medium" style={{ color: colors.primary }}>
                    Lupa sandi?
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                className="flex-row items-center border rounded-xl px-3.5 py-1"
                style={{
                  borderColor: colors.border,
                  backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                }}
              >
                <Lock size={18} color={colors.textSecondary} />
                <TextInput
                  className="flex-1 py-3 px-2.5 text-sm"
                  style={{ color: colors.text }}
                  placeholder="Masukkan kata sandi"
                  placeholderTextColor={colors.textSecondary}
                  value={formLogin.password}
                  onChangeText={(e) =>
                    setFormLogin((prev) => ({
                      ...prev,
                      password: e,
                    }))
                  }
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="password"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="p-1">
                  {showPassword ? (
                    <EyeOff size={18} color={colors.textSecondary} />
                  ) : (
                    <Eye size={18} color={colors.textSecondary} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={() => onLogin()}
              disabled={isPending}
              className="w-full flex-row items-center justify-center py-3.5 px-4 rounded-xl mt-2 active:opacity-90"
              style={{
                backgroundColor: colors.primary,
                opacity: isPending ? 0.6 : 1,
              }}
            >
              <Text
                className="font-semibold text-sm mr-2"
                style={{ color: colors.primaryForeground }}
              >
                {isPending ? 'Memproses...' : 'Masuk'}
              </Text>
              {!isPending && <ArrowRight size={16} color={colors.primaryForeground} />}
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center my-2">
              <View className="flex-1 h-px" style={{ backgroundColor: colors.border }} />
              <Text className="px-3 text-xs" style={{ color: colors.textSecondary }}>
                atau
              </Text>
              <View className="flex-1 h-px" style={{ backgroundColor: colors.border }} />
            </View>

            {/* OAuth Buttons */}
            <TouchableOpacity
              onPress={() => {
                alert.toast({
                  title: 'Info',
                  message: 'Login Google di perangkat mobile segera hadir.',
                  icon: 'info',
                });
              }}
              className="w-full py-3 px-4 rounded-xl border flex-row items-center justify-center active:opacity-80"
              style={{ borderColor: colors.border }}
            >
              <Text className="font-medium text-xs" style={{ color: colors.text }}>
                Lanjutkan dengan Google
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer Info */}
          <View className="mt-8 items-center space-y-2">
            <Text className="text-xs text-center" style={{ color: colors.textSecondary }}>
              Spaces © 2025. Dirancang untuk keheningan dan produktivitas mendalam.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
