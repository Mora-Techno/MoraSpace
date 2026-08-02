import "@/styles/global.css";
import "@/utils/api.setup";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AppProviders } from "@/core/providers/app-providers";
import { RootLayoutContent } from "@/core/providers/root-layout-content";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Parkinsans-Light": require("@/assets/font/Parkinsans/static/Parkinsans-Light.ttf"),
    "Parkinsans-Regular": require("@/assets/font/Parkinsans/static/Parkinsans-Regular.ttf"),
    "Parkinsans-Medium": require("@/assets/font/Parkinsans/static/Parkinsans-Medium.ttf"),
    "Parkinsans-SemiBold": require("@/assets/font/Parkinsans/static/Parkinsans-SemiBold.ttf"),
    "Parkinsans-Bold": require("@/assets/font/Parkinsans/static/Parkinsans-Bold.ttf"),
    "Parkinsans-ExtraBold": require("@/assets/font/Parkinsans/static/Parkinsans-ExtraBold.ttf"),
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
