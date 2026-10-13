import '@/styles/global.css';
import '@/utils/api.setup';

import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import { Fraunces_600SemiBold, Fraunces_700Bold } from '@expo-google-fonts/fraunces';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AppProviders } from '@/core/providers/app-providers';
import { RootLayoutContent } from '@/core/providers/root-layout-content';

SplashScreen.preventAutoHideAsync();

// Raw RN <Text> inherits the brand sans family; ui/Text overrides per-variant.
// biome-ignore lint/suspicious/noExplicitAny: RN Text.defaultProps is untyped.
const RNText = Text as any;
RNText.defaultProps = {
  ...RNText.defaultProps,
  style: [{ fontFamily: 'DMSans_400Regular' }, RNText.defaultProps?.style],
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
    Fraunces_600SemiBold,
    Fraunces_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProviders>
        <RootLayoutContent />
      </AppProviders>
    </GestureHandlerRootView>
  );
}
