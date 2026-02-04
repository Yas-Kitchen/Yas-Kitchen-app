import { GlobalProvider } from "@/context/GlobalContext";
import { AlertProvider } from "@/context/AlertContext";
import { Stack } from "expo-router";
import "./globals.css";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { Platform, View } from "react-native";

// Prevent auto hiding splash screen
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Hide splash screen immediately as we don't have async assets to wait for
    SplashScreen.hideAsync();
  }, []);

  const content = (
    <GlobalProvider>
      <AlertProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AlertProvider>
    </GlobalProvider>
  );

  if (Platform.OS === "web") {
    return (
      <View className="flex-1 bg-gray-100 items-center justify-center">
        <View className="w-full max-w-[450px] h-full bg-white shadow-lg overflow-hidden">
          {content}
        </View>
      </View>
    );
  }

  return content;
}
