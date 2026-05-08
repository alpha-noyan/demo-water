import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <Stack>
        <Stack.Screen name='index' options={{ headerTitle: 'Stock Menu' }} />
        <Stack.Screen name='raw' options={{ headerTitle: 'Raw Items' }} />
        <Stack.Screen name='inbound' options={{ headerTitle: 'Inbound Stock' }} />
        <Stack.Screen name='ready' options={{ headerTitle: 'Ready Items' }} />
        <Stack.Screen name='transactions' options={{ headerTitle: 'Stock Transactions' }} />
    </Stack>
  )
}

export default _layout