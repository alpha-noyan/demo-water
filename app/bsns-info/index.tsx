import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";

const index = () => {
  const [info, setInfo] = useState({
    name: "Khattak Traders",
    amount: 20,
  });
  const [popup, setPopup] = useState(false);
  return popup ? (
    <View>
      <Text>Add Cash</Text>
      <View>
        <Text>Name</Text>
        <TextInput/>
      </View>
      <View>
        <Text>Amount</Text>
        <TextInput/>
      </View>
    </View>
  ) : (
    <View>
      <Text>Business Information</Text>
      <View>
        <View>
          <TouchableOpacity>
            <Text>Name</Text>
            <Text>{info.name}</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text>Amount</Text>
          <Text>{info.amount}</Text>
        </View>
      </View>
      <View>
        <View>
          <TouchableOpacity onPress={()=>setPopup(true)}>
            <Text>Add Cash</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={()=>router.push('/bsns-info/transactions')}>
            <Text>Transactions</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default index;
