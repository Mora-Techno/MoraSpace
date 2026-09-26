import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Api from "@/service/props.service";

// Konfigurasi bagaimana notifikasi ditampilkan saat aplikasi foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldPresentAlert: true,
  }),
});

/**
 * Mendaftarkan push token perangkat ke backend Spaces.
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  let token: string | null = null;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#2563eb",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      console.warn("Permission push notification tidak diberikan oleh pengguna.");
      return null;
    }

    try {
      const pushTokenData = await Notifications.getExpoPushTokenAsync();
      token = pushTokenData.data;

      // Kirim push token ke service notification backend jika tersedia
      if (token) {
        try {
          await Api.Notification.SendNotification({
            recipient: "device-push-token",
            subject: "Device Registered",
            body: token,
          });
        } catch {}
      }
    } catch (error) {
      console.error("Gagal mendapatkan Expo Push Token:", error);
    }
  } else {
    console.log("Push notifications hanya berjalan pada perangkat fisik.");
  }

  return token;
}
