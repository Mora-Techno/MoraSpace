import { ArrowLeft } from 'lucide-react-native';
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { useTheme } from '@/core/providers/theme.provinder';

export interface BlogDetailVM {
  category: string;
  title: string;
  excerpt: string;
  metaLine: string;
  paragraphs: string[];
}

interface BlogDetailSectionProps {
  service: {
    post: BlogDetailVM | null;
    isLoading: boolean;
    isError: boolean;
    onBack: () => void;
  };
}

export function BlogDetailSection({ service }: BlogDetailSectionProps) {
  const { colors } = useTheme();
  const { post, isLoading, isError, onBack } = service;

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <View
        className="flex-row items-center px-2 py-2 border-b"
        style={{ borderColor: colors.border }}
      >
        <TouchableOpacity onPress={onBack} className="p-2">
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <Text className="text-sm font-semibold" style={{ color: colors.text }}>
          Artikel
        </Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : isError || !post ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-sm font-medium text-center" style={{ color: colors.text }}>
            Artikel tidak ditemukan.
          </Text>
        </View>
      ) : (
        <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
          <Text className="text-[11px] font-semibold" style={{ color: colors.primary }}>
            {post.category}
          </Text>
          <Text className="text-2xl font-bold mt-1 leading-snug" style={{ color: colors.text }}>
            {post.title}
          </Text>
          <Text className="text-sm mt-2 leading-relaxed" style={{ color: colors.textSecondary }}>
            {post.excerpt}
          </Text>
          <Text className="text-[11px] mt-3" style={{ color: colors.textSecondary }}>
            {post.metaLine}
          </Text>
          <View className="mt-4 mb-10">
            {post.paragraphs.map((para, i) => (
              <Text key={i} className="text-sm leading-loose mb-4" style={{ color: colors.text }}>
                {para}
              </Text>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
