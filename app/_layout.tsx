import { Stack } from 'expo-router';
import { useEffect } from 'react';
import {init} from '../db/init'

export default function RootLayout() {

  useEffect(()=>{
    init();
  },[])

  return (
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="bsns-info" options={{headerShown:false}} />
        <Stack.Screen name='employees' options={{headerShown:false}} />
        <Stack.Screen name='cashouts' options={{headerShown:false}}  />
        <Stack.Screen name='vehicles' options={{headerShown:false}}  />
        <Stack.Screen name='wasooli' options={{headerShown:false}}  />
        <Stack.Screen name='other-expenses' options={{headerShown:false}}  />
        <Stack.Screen name='sales' options={{headerShown:false}}  />
        <Stack.Screen name='stock' options={{headerShown:false}}  />
        <Stack.Screen name='orders' options={{headerShown:false}}  />
      </Stack>
  );
}
