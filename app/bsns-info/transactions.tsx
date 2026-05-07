import { View, Text, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { BsnsContext } from './context'

const transactions = () => {
    const {transactions,reverseTransaction} = useContext(BsnsContext)
  return (
    <View>
      <Text>transactions</Text>
      <View>
        {
            transactions.map((item,idx)=>{
                return(
                    <>
                    <View>
                        <View>
                            Name: {item.name}
                        </View>
                        <View>
                            Amount: {item.amount}
                        </View>
                        <View>
                            Status: {item.status}
                        </View>
                        <TouchableOpacity onPress={()=>reverseTransaction(idx)}>
                            <Text>
                                Reverse
                            </Text>
                        </TouchableOpacity>
                    </View>
                    </>
                )
            })
        }
      </View>
    </View>
  )
}

export default transactions