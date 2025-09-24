import { GlobalProvider } from "@/context/GlobalContext";
import { Stack } from "expo-router";
import "./globals.css";

export default function RootLayout() {
  return (
    <GlobalProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </GlobalProvider>
  );
}
