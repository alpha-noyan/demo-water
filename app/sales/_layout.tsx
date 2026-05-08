import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <Stack>
        <Stack.Screen name='index' options={{ headerTitle: 'Sales' }} />
        <Stack.Screen name='transactions' options={{ headerTitle: 'Transactions' }} />
    </Stack>
  )
}

export default _layout