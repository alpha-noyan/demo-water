import { Stack } from 'expo-router';

export default function RootLayout() {

  return (
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="bsns-info" options={{headerShown:false}} />
        <Stack.Screen name='employees' options={{headerShown:false}} />
      </Stack>
  );
}
