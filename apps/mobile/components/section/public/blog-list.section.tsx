import { ActivityIndicator, FlatList, TextInput, TouchableOpacity, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { useTheme } from '@/core/providers/theme.provinder';

export interface BlogCardVM {
  id: string;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  metaLine: string;
  readTime: string;
}

interface BlogListSectionProps {
  service: {
    categories: string[];
    articles: BlogCardVM[];
    isLoading: boolean;
    isError: boolean;
    selectedCategory: string | null;
    onSelectCategory: (c: string | null) => void;
    onOpenArticle: (slug: string) => void;
    onRetry: () => void;
  };
  state: {
    filter: string;
    setFilter: (v: string) => void;
  };
}

export function BlogListSection({ service, state }: BlogListSectionProps) {
  const { colors } = useTheme();
  const {
    categories,
    articles,
    isLoading,
    isError,
    selectedCategory,
    onSelectCategory,
    onOpenArticle,
    onRetry,
  } = service;
  const { filter, setFilter } = state;

  return (
    <View className="flex-1 px-4 pt-6" style={{ backgroundColor: colors.background }}>
      <Text className="text-2xl font-bold" style={{ color: colors.text }}>
        Blog
      </Text>
      <Text className="text-xs mt-0.5 mb-3" style={{ color: colors.textSecondary }}>
        Cerita, panduan, dan kabar produk.
      </Text>

      <View
        className="flex-row items-center rounded-xl border px-3 mb-2"
        style={{ borderColor: colors.border }}
      >
        <TextInput
          value={filter}
          onChangeText={setFilter}
          placeholder="Cari artikel..."
          placeholderTextColor={colors.textSecondary}
          className="flex-1 py-2.5 text-sm"
          style={{ color: colors.text }}
        />
      </View>

      <View className="flex-row flex-wrap gap-2 mb-2">
        <TouchableOpacity
          onPress={() => onSelectCategory(null)}
          className="px-3 py-1.5 rounded-full border"
          style={{
            borderColor: colors.border,
            backgroundColor: selectedCategory === null ? colors.primary : 'transparent',
          }}
        >
          <Text
            className="text-[11px] font-semibold"
            style={{
              color: selectedCategory === null ? colors.primaryForeground : colors.textSecondary,
            }}
          >
            Semua
          </Text>
        </TouchableOpacity>
        {categories.map((c) => (
          <TouchableOpacity
            key={c}
            onPress={() => onSelectCategory(selectedCategory === c ? null : c)}
            className="px-3 py-1.5 rounded-full border"
            style={{
              borderColor: colors.border,
              backgroundColor: selectedCategory === c ? colors.primary : 'transparent',
            }}
          >
            <Text
              className="text-[11px] font-semibold"
              style={{
                color: selectedCategory === c ? colors.primaryForeground : colors.textSecondary,
              }}
            >
              {c}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-sm" style={{ color: colors.textSecondary }}>
            Gagal memuat artikel.
          </Text>
          <TouchableOpacity
            onPress={onRetry}
            className="mt-3 px-5 py-2.5 rounded-xl border"
            style={{ borderColor: colors.border }}
          >
            <Text className="text-xs font-semibold" style={{ color: colors.primary }}>
              Coba lagi
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(p) => p.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center py-16">
              <Text className="text-sm" style={{ color: colors.textSecondary }}>
                Belum ada artikel.
              </Text>
            </View>
          }
          renderItem={({ item: p }) => (
            <TouchableOpacity
              onPress={() => onOpenArticle(p.slug)}
              className="rounded-2xl border p-4 mb-3"
              style={{ borderColor: colors.border, backgroundColor: colors.card }}
            >
              <Text className="text-[11px] font-semibold" style={{ color: colors.primary }}>
                {p.category}
              </Text>
              <Text
                className="text-base font-bold mt-1"
                style={{ color: colors.text }}
                numberOfLines={2}
              >
                {p.title}
              </Text>
              <Text
                className="text-xs mt-1"
                style={{ color: colors.textSecondary }}
                numberOfLines={3}
              >
                {p.excerpt}
              </Text>
              <View className="flex-row items-center justify-between mt-3">
                <Text className="text-[11px]" style={{ color: colors.textSecondary }}>
                  {p.metaLine}
                </Text>
                <Text className="text-[11px]" style={{ color: colors.textSecondary }}>
                  {p.readTime}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
