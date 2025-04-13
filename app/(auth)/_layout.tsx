import { useAuth } from "@/ctx/Session";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  if (isLoggedIn) {
    return <Redirect href="/(protected)/(tabs)" />;
  }

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
    </Stack>
  )
}