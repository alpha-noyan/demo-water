import React from 'react'
import { Stack } from 'expo-router'
import { EmployeesProvider } from './context'

const EmployeesLayout = () => {
  return (
    <EmployeesProvider>
      <Stack>
        <Stack.Screen 
          name='index' 
          options={{
            title: 'Employees',
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name='transactions' 
          options={{
            title: 'Transactions',
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name='employee-details' 
          options={{
            title: 'Employee Details',
            headerShown: false,
          }} 
        />
      </Stack>
    </EmployeesProvider>
  )
}

export default EmployeesLayout