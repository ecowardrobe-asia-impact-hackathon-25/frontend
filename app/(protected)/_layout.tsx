import { useAuth } from "@/ctx/Session";
import { Redirect, Stack } from "expo-router";

export default function RootLayout() {
  const { user } = useAuth();

  const isLoggedIn = !!user;
  
  if (!isLoggedIn) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="upload" options={{ headerShown: false }} />
    </Stack>
  )
}