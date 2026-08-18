import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#ffffff' },
          headerTintColor: '#0f172a',
          headerTitleStyle: { fontWeight: '700', fontSize: 17 },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: '#f8fafc' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="results"
          options={{
            title: 'Screening Results',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="facilities"
          options={{ title: 'Nearby Eye Clinics' }}
        />
        <Stack.Screen
          name="chatbot"
          options={{ title: 'AI Health Assistant' }}
        />
      </Stack>
    </>
  );
}
