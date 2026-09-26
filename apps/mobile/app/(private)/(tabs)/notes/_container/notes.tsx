import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Plus, Trash2, FileText } from "lucide-react-native";
import { useNotess } from "@/hooks/service/Note/useNotes";
import { useTheme } from "@/core/providers/theme.provinder";

export function MobileNotesContainer() {
  const { colors, isDark } = useTheme();
  const { query, mutate } = useNotess();
  const { data: notes = [], isLoading } = query.get();
  const createNote = mutate.create();
  const deleteNote = mutate.delete();

  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleCreate = () => {
    if (!title.trim()) return;
    createNote.mutate(
      {
        title: title.trim(),
        content: content.trim() || "",
      },
      {
        onSuccess: () => {
          setTitle("");
          setContent("");
          setModalVisible(false);
        },
      },
    );
  };

  return (
    <View className="flex-1 p-4" style={{ backgroundColor: colors.background }}>
      <View className="flex-row items-center justify-between mb-4">
        <View>
          <Text className="text-xl font-bold" style={{ color: colors.text }}>
            Catatan
          </Text>
          <Text className="text-xs text-gray-500">Kumpulan memo & catatan ide</Text>
        </View>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="p-2.5 rounded-full"
          style={{ backgroundColor: colors.primary }}
        >
          <Plus size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              className="p-4 mb-3 rounded-xl border"
              style={{
                backgroundColor: colors.card,
                borderColor: isDark ? colors.border : "#e5e7eb",
              }}
            >
              <View className="flex-row items-start justify-between">
                <View className="flex-1 mr-2">
                  <Text className="text-sm font-bold" style={{ color: colors.text }}>
                    {item.title}
                  </Text>
                  {item.content && (
                    <Text className="text-xs text-gray-500 mt-1 line-clamp-3">
                      {item.content}
                    </Text>
                  )}
                </View>

                <TouchableOpacity
                  onPress={() => deleteNote.mutate(item.id)}
                  className="p-1"
                >
                  <Trash2 size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View className="items-center justify-center py-16">
              <Text className="text-xs text-gray-400">Belum ada catatan.</Text>
            </View>
          }
        />
      )}

      {/* Modal Tambah Catatan */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View className="flex-1 items-center justify-center bg-black/50 p-4">
          <View
            className="w-full max-w-sm p-5 rounded-2xl border"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
            }}
          >
            <Text className="text-base font-bold mb-3" style={{ color: colors.text }}>
              Catatan Baru
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Judul catatan..."
              placeholderTextColor={colors.textSecondary}
              className="p-3 border rounded-xl mb-3 text-sm"
              style={{
                color: colors.text,
                borderColor: colors.border,
              }}
            />
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder="Tuliskan isi catatan..."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={4}
              className="p-3 border rounded-xl mb-4 text-sm"
              style={{
                color: colors.text,
                borderColor: colors.border,
                textAlignVertical: "top",
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
                onPress={handleCreate}
                disabled={createNote.isPending}
                className="px-4 py-2 rounded-lg"
                style={{ backgroundColor: colors.primary }}
              >
                <Text className="text-white font-semibold text-xs">
                  {createNote.isPending ? "Menyimpan..." : "Simpan"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
