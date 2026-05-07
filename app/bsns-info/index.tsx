import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useContext, useState } from "react";
import { router } from "expo-router";
import { BsnsContext, useBsns } from "./context";

const index = () => {
  const { info, popup, setPopup } = useContext(BsnsContext);
  const [addingInfo, setAddingInfo] = useState({
    name: "",
    amount: 0,
  });
  function handleChange(field, value) {
    setAddingInfo((prev) => ({
      ...prev,
      [field]: field === "amount" ? Number(value) : value,
    }));
  }
  return popup ? (
    <View>
      <Text>Add Cash</Text>
      <View>
        <Text>Name</Text>
        <TextInput
          onChangeText={(text) => handleChange("name", text)}
          value={addingInfo.name}
        />
      </View>
      <View>
        <Text>Amount</Text>
        <TextInput
          keyboardType="numeric"
          onChangeText={(text) => handleChange("amount", text)}
          value={String(addingInfo.amount)}
        />
      </View>
      <TouchableOpacity>
        <Text>Add</Text>
      </TouchableOpacity>
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
          <TouchableOpacity onPress={() => setPopup(true)}>
            <Text>Add Cash</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => router.push("/bsns-info/transactions")}
          >
            <Text>Transactions</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default index;
