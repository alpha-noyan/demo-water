import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TextInput,
  FlatList,
  Alert,
} from "react-native";
import {fetchRawItems} from "../../db/stock"

const Inbound = () => {
  const [rawItems, setRawItems] = useState([]);

  const [selectedItems, setSelectedItems] =
    useState([]);

  const [quantities, setQuantities] = useState(
    {}
  );

  const [totalAmount, setTotalAmount] =
    useState("");

  // Select / Unselect Items
  const toggleItem = (item) => {
    const exists = selectedItems.includes(item);

    if (exists) {
      setSelectedItems(
        selectedItems.filter((i) => i !== item)
      );

      const updatedQuantities = {
        ...quantities,
      };

      delete updatedQuantities[item];

      setQuantities(updatedQuantities);
    } else {
      setSelectedItems([
        ...selectedItems,
        item,
      ]);

      setQuantities({
        ...quantities,
        [item]: "",
      });
    }
  };

  // Handle Quantity Change
  const handleQuantityChange = (
    item,
    value
  ) => {
    setQuantities({
      ...quantities,
      [item]: value,
    });
  };

  // fetch raw items
  async function fetchItems() {
    try{
      const items = await fetchRawItems();
      setRawItems(items);
    } catch (error) {
      console.error("Error fetching raw items:", error);
      Alert.alert(
        "Error",
        "Failed to fetch raw items. Please try again later."
      );
    }
  }
  useEffect(() => {
    fetchItems();
  }, []);

  // Reset Form
  const resetForm = () => {
    setSelectedItems([]);
    setQuantities({});
    setTotalAmount("");
  };

  // Submit
  const handleSubmit = () => {
    if (selectedItems.length === 0) {
      Alert.alert(
        "No Items Selected",
        "Please select at least one raw item."
      );

      return;
    }

    const hasEmptyQuantity =
      selectedItems.some(
        (item) => !quantities[item]
      );

    if (hasEmptyQuantity) {
      Alert.alert(
        "Missing Quantity",
        "Please enter quantities for all selected items."
      );

      return;
    }

    if (!totalAmount) {
      Alert.alert(
        "Missing Amount",
        "Please enter total amount."
      );

      return;
    }

    const payload = {
      items: selectedItems.map((item) => ({
        name: item,
        quantity: quantities[item],
      })),
      amount: totalAmount,
      date: new Date().toLocaleString(),
    };

    console.log("Inbound Data:", payload);

    Alert.alert(
      "Success",
      "Inbound stock submitted successfully."
    );

    resetForm();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor="#DDF6FF"
        barStyle="dark-content"
      />

      <FlatList
        data={[]}
        renderItem={null}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>
                Inbound Stock
              </Text>

              <Text style={styles.headerSubtitle}>
                Add incoming raw stock items
              </Text>
            </View>

            {/* Select Items */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Select Raw Items
              </Text>

              <View style={styles.itemsContainer}>
                {rawItems.map((item) => {
                  const active =
                    selectedItems.includes(item);

                  return (
                    <TouchableOpacity
                      key={item}
                      activeOpacity={0.8}
                      onPress={() =>
                        toggleItem(item)
                      }
                      style={[
                        styles.itemButton,
                        active &&
                          styles.itemButtonActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.itemButtonText,
                          active &&
                            styles
                              .itemButtonTextActive,
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Quantity Inputs */}
            {selectedItems.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Selected Items Quantity
                </Text>

                {selectedItems.map((item) => (
                  <View
                    key={item}
                    style={styles.inputCard}
                  >
                    <Text style={styles.label}>
                      {item}
                    </Text>

                    <TextInput
                      placeholder={`Enter ${item} quantity`}
                      placeholderTextColor="#94A3B8"
                      keyboardType="numeric"
                      value={quantities[item]}
                      onChangeText={(value) =>
                        handleQuantityChange(
                          item,
                          value
                        )
                      }
                      style={styles.input}
                    />
                  </View>
                ))}
              </View>
            )}

            {/* Total Amount */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Total Amount
              </Text>

              <View style={styles.amountCard}>
                <Text style={styles.label}>
                  Enter Total Amount
                </Text>

                <TextInput
                  placeholder="Enter amount"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={totalAmount}
                  onChangeText={setTotalAmount}
                  style={styles.input}
                />
              </View>
            </View>

            {/* Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.buttonText}>
                  Submit
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={resetForm}
              >
                <Text style={styles.cancelText}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </>
        }
        contentContainerStyle={{
          paddingBottom: 40,
        }}
      />
    </SafeAreaView>
  );
};

export default Inbound;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F8FB",
  },

  header: {
    backgroundColor: "#DDF6FF",
    padding: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 24,
  },

  headerTitle: {
    fontSize: 30,
    fontWeight: "700",
    color: "#0F172A",
  },

  headerSubtitle: {
    marginTop: 6,
    color: "#64748B",
    fontSize: 15,
  },

  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 18,
  },

  itemsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  itemButton: {
    backgroundColor: "#E2E8F0",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 16,
  },

  itemButtonActive: {
    backgroundColor: "#38BDF8",
  },

  itemButtonText: {
    color: "#334155",
    fontWeight: "600",
    fontSize: 15,
  },

  itemButtonTextActive: {
    color: "#FFFFFF",
  },

  inputCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,

    elevation: 3,
  },

  amountCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,

    elevation: 3,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 10,
  },

  input: {
    backgroundColor: "#EFF6FB",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#0F172A",
  },

  buttonRow: {
    flexDirection: "row",
    gap: 14,
    marginHorizontal: 20,
    marginTop: 10,
  },

  submitButton: {
    flex: 1,
    backgroundColor: "#38BDF8",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
  },

  cancelButton: {
    flex: 1,
    backgroundColor: "#E2E8F0",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },

  cancelText: {
    color: "#334155",
    fontWeight: "700",
    fontSize: 16,
  },
});