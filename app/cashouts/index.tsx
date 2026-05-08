import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'

const index = () => {
  return (
    <View>
      <Text>Cashouts</Text>
      <View>
        <Text>Make Cashout</Text>
        <Text>Amount</Text>
        <TextInput placeholder='Enter amount' keyboardType='numeric' />
        <Text>Reason</Text>
        <TextInput placeholder='Enter reason' />
      </View>
      <View>
        <Text>Cashout History</Text>
        {/* List of cashouts */}
        <View>
          <Text>Amount 200000</Text>
          <Text>Reason: Office Supplies</Text>
          <TouchableOpacity>
            <Text>Return Cashout</Text>
          </TouchableOpacity>
        </View>
        {/* Pagination */}
        <View>
          <TouchableOpacity>
            <Text>Previous</Text>
          </TouchableOpacity>
          <Text>Page 1 of 5</Text>
          <TouchableOpacity>
            <Text>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default index