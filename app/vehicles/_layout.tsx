import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <Stack>
        <Stack.Screen name='index' options={{ headerTitle: 'Vehicles' }} />
    </Stack>
  )
}

export default _layout