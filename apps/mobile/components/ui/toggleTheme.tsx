import { Feather } from '@expo/vector-icons';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { useTheme } from '@/core/providers/theme.provinder';

export default function ThemeToggle() {
  const { theme, toggleTheme, colors } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onPress={toggleTheme}
      className="w-9 h-9 rounded-md"
      accessibilityLabel="Toggle theme"
    >
      <View>
        {theme === 'dark' ? (
          <Feather name="moon" size={20} color={colors.primary} />
        ) : (
          <Feather name="sun" size={20} color={colors.primary} />
        )}
      </View>
    </Button>
  );
}
