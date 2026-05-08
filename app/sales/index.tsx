import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TextInput,
  FlatList,
  Switch,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";

const Index = () => {
  const router = useRouter();

  const products = [
    {
      id: "1",
      name: "500ml Water Bottle",
      price: 50,
    },
    {
      id: "2",
      name: "1L Water Bottle",
      price: 90,
    },
    {
      id: "3",
      name: "2L Water Bottle",
      price: 150,
    },
  ];

  const [clientName, setClientName] =
    useState("");

  const [clientAddress, setClientAddress] =
    useState("");

  const [deliver, setDeliver] =
    useState(false);

  const [deliveryPerson, setDeliveryPerson] =
    useState("");

  const [deliveryCommission, setDeliveryCommission] =
    useState("");

  const [selectedProducts, setSelectedProducts] =
    useState([]);

  const [quantities, setQuantities] =
    useState({});

  // Select Product
  const toggleProduct = (product) => {
    const exists = selectedProducts.find(
      (p) => p.id === product.id
    );

    if (exists) {
      setSelectedProducts(
        selectedProducts.filter(
          (p) => p.id !== product.id
        )
      );

      const updated = {
        ...quantities,
      };

      delete updated[product.id];

      setQuantities(updated);
    } else {
      setSelectedProducts([
        ...selectedProducts,
        product,
      ]);

      setQuantities({
        ...quantities,
        [product.id]: "",
      });
    }
  };

  // Quantity Change
  const handleQuantityChange = (
    id,
    value
  ) => {
    setQuantities({
      ...quantities,
      [id]: value,
    });
  };

  // Total Bill
  const totalBill = useMemo(() => {
    let total = 0;

    selectedProducts.forEach((product) => {
      const quantity =
        Number(quantities[product.id]) || 0;

      total += quantity * product.price;
    });

    if (deliver) {
      total +=
        Number(deliveryCommission) || 0;
    }

    return total;
  }, [
    selectedProducts,
    quantities,
    deliveryCommission,
    deliver,
  ]);

  // Reset Form
  const resetForm = () => {
    setClientName("");
    setClientAddress("");
    setDeliver(false);
    setDeliveryPerson("");
    setDeliveryCommission("");
    setSelectedProducts([]);
    setQuantities({});
  };

  // Sell
  const handleSell = () => {
    if (!clientName.trim()) {
      Alert.alert(
        "Missing Client",
        "Please enter client name."
      );

      return;
    }

    if (selectedProducts.length === 0) {
      Alert.alert(
        "No Products",
        "Please select products."
      );

      return;
    }

    const hasEmptyQuantity =
      selectedProducts.some(
        (product) =>
          !quantities[product.id]
      );

    if (hasEmptyQuantity) {
      Alert.alert(
        "Missing Quantity",
        "Please enter product quantities."
      );

      return;
    }

    if (deliver && !deliveryPerson) {
      Alert.alert(
        "Missing Delivery Person",
        "Please enter delivery person name."
      );

      return;
    }

    const invoice = {
      clientName,
      clientAddress,
      deliver,
      deliveryPerson,
      deliveryCommission,
      products: selectedProducts.map(
        (product) => ({
          name: product.name,
          quantity:
            quantities[product.id],
          price: product.price,
        })
      ),
      totalBill,
      date: new Date().toLocaleString(),
    };

    console.log("Invoice:", invoice);

    Alert.alert(
      "Success",
      "Invoice created successfully."
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
              <View>
                <Text style={styles.headerTitle}>
                  Sales
                </Text>

                <Text
                  style={styles.headerSubtitle}
                >
                  Create sales invoice
                </Text>
              </View>

              <TouchableOpacity
                style={
                  styles.transactionButton
                }
                onPress={() =>
                  router.push(
                    "/sales/transactions"
                  )
                }
              >
                <Text
                  style={
                    styles.transactionButtonText
                  }
                >
                  Transactions
                </Text>
              </TouchableOpacity>
            </View>

            {/* Invoice */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Invoice Details
              </Text>

              <View style={styles.card}>
                <Text style={styles.label}>
                  Client Name
                </Text>

                <TextInput
                  placeholder="Enter Client Name"
                  placeholderTextColor="#94A3B8"
                  value={clientName}
                  onChangeText={setClientName}
                  style={styles.input}
                />

                <Text style={styles.label}>
                  Client Address
                </Text>

                <TextInput
                  placeholder="Enter Client Address"
                  placeholderTextColor="#94A3B8"
                  value={clientAddress}
                  onChangeText={
                    setClientAddress
                  }
                  style={styles.input}
                />

                {/* Delivery Toggle */}
                <View
                  style={
                    styles.deliveryToggle
                  }
                >
                  <Text
                    style={styles.deliveryText}
                  >
                    Deliver
                  </Text>

                  <Switch
                    value={deliver}
                    onValueChange={setDeliver}
                    trackColor={{
                      false: "#CBD5E1",
                      true: "#38BDF8",
                    }}
                    thumbColor="#FFFFFF"
                  />
                </View>

                {/* Delivery Fields */}
                {deliver && (
                  <>
                    <Text
                      style={styles.label}
                    >
                      Delivery Person Name
                    </Text>

                    <TextInput
                      placeholder="Enter Delivery Person Name"
                      placeholderTextColor="#94A3B8"
                      value={deliveryPerson}
                      onChangeText={
                        setDeliveryPerson
                      }
                      style={styles.input}
                    />

                    <Text
                      style={styles.label}
                    >
                      Delivery Commission
                    </Text>

                    <TextInput
                      placeholder="0"
                      placeholderTextColor="#94A3B8"
                      keyboardType="numeric"
                      value={
                        deliveryCommission
                      }
                      onChangeText={
                        setDeliveryCommission
                      }
                      style={styles.input}
                    />
                  </>
                )}
              </View>
            </View>

            {/* Products */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Products
              </Text>

              <View
                style={
                  styles.productsContainer
                }
              >
                {products.map((product) => {
                  const active =
                    selectedProducts.find(
                      (p) =>
                        p.id === product.id
                    );

                  return (
                    <TouchableOpacity
                      key={product.id}
                      style={[
                        styles.productButton,
                        active &&
                          styles.productButtonActive,
                      ]}
                      onPress={() =>
                        toggleProduct(product)
                      }
                    >
                      <Text
                        style={[
                          styles.productButtonText,
                          active &&
                            styles.productButtonTextActive,
                        ]}
                      >
                        {product.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Quantity Inputs */}
            {selectedProducts.length > 0 && (
              <View style={styles.section}>
                <Text
                  style={styles.sectionTitle}
                >
                  Product Quantities
                </Text>

                {selectedProducts.map(
                  (product) => (
                    <View
                      key={product.id}
                      style={
                        styles.quantityCard
                      }
                    >
                      <View
                        style={
                          styles.quantityTop
                        }
                      >
                        <Text
                          style={
                            styles.quantityTitle
                          }
                        >
                          {product.name}
                        </Text>

                        <Text
                          style={
                            styles.priceText
                          }
                        >
                          ₨ {product.price}
                        </Text>
                      </View>

                      <TextInput
                        placeholder="0"
                        placeholderTextColor="#94A3B8"
                        keyboardType="numeric"
                        value={
                          quantities[
                            product.id
                          ]
                        }
                        onChangeText={(
                          value
                        ) =>
                          handleQuantityChange(
                            product.id,
                            value
                          )
                        }
                        style={styles.input}
                      />
                    </View>
                  )
                )}
              </View>
            )}

            {/* Total Bill */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Total Bill
              </Text>

              <View style={styles.totalCard}>
                <Text style={styles.totalLabel}>
                  Invoice Total
                </Text>

                <Text style={styles.totalAmount}>
                  ₨ {totalBill}
                </Text>
              </View>
            </View>

            {/* Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.sellButton}
                onPress={handleSell}
              >
                <Text style={styles.buttonText}>
                  Sell
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={resetForm}
              >
                <Text
                  style={styles.cancelText}
                >
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

export default Index;

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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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

  transactionButton: {
    backgroundColor: "#38BDF8",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 16,
  },

  transactionButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
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

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
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
    marginBottom: 18,
  },

  deliveryToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: 16,
    marginBottom: 18,
  },

  deliveryText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },

  productsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  productButton: {
    backgroundColor: "#E2E8F0",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 16,
  },

  productButtonActive: {
    backgroundColor: "#38BDF8",
  },

  productButtonText: {
    color: "#334155",
    fontWeight: "600",
  },

  productButtonTextActive: {
    color: "#FFFFFF",
  },

  quantityCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    marginBottom: 18,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,

    elevation: 3,
  },

  quantityTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  quantityTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
  },

  priceText: {
    color: "#0284C7",
    fontWeight: "700",
  },

  totalCard: {
    backgroundColor: "#DDF6FF",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
  },

  totalLabel: {
    color: "#64748B",
    fontSize: 15,
    marginBottom: 8,
  },

  totalAmount: {
    fontSize: 34,
    fontWeight: "700",
    color: "#0284C7",
  },

  buttonRow: {
    flexDirection: "row",
    gap: 14,
    marginHorizontal: 20,
    marginTop: 10,
  },

  sellButton: {
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