import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TextInput,
  FlatList,
  Modal,
  Alert,
  ScrollView,
} from "react-native";

const Ready = () => {
  const rawItems = [
    "Bottle",
    "Cap",
    "Label",
    "Plastic Wrapper",
  ];

  const [products, setProducts] = useState([
    {
      id: "1",
      name: "500ml Water Bottle",
      stock: 100,
      recipe: {
        Bottle: 1,
        Cap: 1,
        Label: 1,
      },
    },
    {
      id: "2",
      name: "1500ml Water Bottle",
      stock: 50,
      recipe: {
        Bottle: 1,
        Cap: 1,
        Label: 1,
      },
    },
  ]);

  // Create Product Modal
  const [createModal, setCreateModal] =
    useState(false);

  const [productName, setProductName] =
    useState("");

  const [selectedRawItems, setSelectedRawItems] =
    useState([]);

  const [rawAmounts, setRawAmounts] =
    useState({});

  // Stock Modal
  const [stockModal, setStockModal] =
    useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const [stockAmount, setStockAmount] =
    useState("");

  // Select Raw Item
  const toggleRawItem = (item) => {
    const exists =
      selectedRawItems.includes(item);

    if (exists) {
      setSelectedRawItems(
        selectedRawItems.filter(
          (i) => i !== item
        )
      );

      const updated = {
        ...rawAmounts,
      };

      delete updated[item];

      setRawAmounts(updated);
    } else {
      setSelectedRawItems([
        ...selectedRawItems,
        item,
      ]);

      setRawAmounts({
        ...rawAmounts,
        [item]: "",
      });
    }
  };

  // Create Product
  const handleCreateProduct = () => {
    if (!productName.trim()) {
      Alert.alert(
        "Missing Name",
        "Please enter product name."
      );

      return;
    }

    if (selectedRawItems.length === 0) {
      Alert.alert(
        "No Raw Items",
        "Please select raw items."
      );

      return;
    }

    const hasEmptyAmounts =
      selectedRawItems.some(
        (item) => !rawAmounts[item]
      );

    if (hasEmptyAmounts) {
      Alert.alert(
        "Missing Amounts",
        "Please enter all raw item amounts."
      );

      return;
    }

    const recipe = {};

    selectedRawItems.forEach((item) => {
      recipe[item] = Number(
        rawAmounts[item]
      );
    });

    const newProduct = {
      id: Date.now().toString(),
      name: productName,
      stock: 0,
      recipe,
    };

    setProducts([...products, newProduct]);

    // Reset
    setProductName("");
    setSelectedRawItems([]);
    setRawAmounts({});

    setCreateModal(false);

    Alert.alert(
      "Success",
      "Ready item created successfully."
    );
  };

  // Open Stock Modal
  const openStockModal = (product) => {
    setSelectedProduct(product);

    setStockAmount("");

    setStockModal(true);
  };

  // Add Stock
  const handleAddStock = () => {
    if (!stockAmount) {
      Alert.alert(
        "Missing Amount",
        "Please enter stock amount."
      );

      return;
    }

    const updated = products.map((item) =>
      item.id === selectedProduct.id
        ? {
            ...item,
            stock:
              item.stock +
              Number(stockAmount),
          }
        : item
    );

    setProducts(updated);

    setStockModal(false);

    Alert.alert(
      "Success",
      "Stock added successfully."
    );
  };

  // Remove Stock
  const handleRemoveStock = () => {
    if (!stockAmount) {
      Alert.alert(
        "Missing Amount",
        "Please enter stock amount."
      );

      return;
    }

    const updated = products.map((item) => {
      if (item.id === selectedProduct.id) {
        const newStock =
          item.stock -
          Number(stockAmount);

        return {
          ...item,
          stock:
            newStock < 0 ? 0 : newStock,
        };
      }

      return item;
    });

    setProducts(updated);

    setStockModal(false);

    Alert.alert(
      "Success",
      "Stock removed successfully."
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor="#DDF6FF"
        barStyle="dark-content"
      />

      {/* Create Product Modal */}
      <Modal
        visible={createModal}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <ScrollView
  style={styles.modalContainer}
  showsVerticalScrollIndicator={false}
>
            <Text style={styles.modalTitle}>
              Create Ready Item
            </Text>

               <Text style={styles.label}>
              Item Name
            </Text>

            <TextInput
              placeholder="Enter item name"
              placeholderTextColor="#94A3B8"
              value={productName}
              onChangeText={setProductName}
              style={styles.input}
            />

            <Text style={styles.label}>
              Raw Items Used
            </Text>

            <View style={styles.rawItemsContainer}>
              {rawItems.map((item) => {
                const active =
                  selectedRawItems.includes(
                    item
                  );

                return (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.rawButton,
                      active &&
                        styles.rawButtonActive,
                    ]}
                    onPress={() =>
                      toggleRawItem(item)
                    }
                  >
                    <Text
                      style={[
                        styles.rawButtonText,
                        active &&
                          styles.rawButtonTextActive,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Amount Inputs */}
            {selectedRawItems.map((item) => (
              <View
                key={item}
                style={styles.amountContainer}
              >
                <Text style={styles.label}>
                  Amount of {item} per
                  Product
                </Text>

                <TextInput
                  placeholder={`Enter ${item} amount`}
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={rawAmounts[item]}
                  onChangeText={(value) =>
                    setRawAmounts({
                      ...rawAmounts,
                      [item]: value,
                    })
                  }
                  style={styles.input}
                />
              </View>
            ))}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleCreateProduct}
              >
                <Text style={styles.buttonText}>
                  Create
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() =>
                  setCreateModal(false)
                }
              >
                <Text style={styles.secondaryText}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
            </ScrollView>
        </View>
      </Modal>

      {/* Stock Modal */}
      <Modal
        visible={stockModal}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Manage Stock
            </Text>

            <Text style={styles.selectedProduct}>
              {selectedProduct?.name}
            </Text>

            <Text style={styles.label}>
              Enter Amount
            </Text>

            <TextInput
              placeholder="Enter amount"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={stockAmount}
              onChangeText={setStockAmount}
              style={styles.input}
            />

            <View style={styles.stockButtons}>
              <TouchableOpacity
                style={styles.addStockButton}
                onPress={handleAddStock}
              >
                <Text style={styles.buttonText}>
                  Add Stock
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.removeStockButton}
                onPress={handleRemoveStock}
              >
                <Text style={styles.buttonText}>
                  Remove
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() =>
                setStockModal(false)
              }
            >
              <Text style={styles.secondaryText}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <FlatList
        data={[]}
        renderItem={null}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>
                Ready Items
              </Text>

              <Text style={styles.headerSubtitle}>
                Manage ready products stock
              </Text>
            </View>

            {/* Create Button */}
            <View style={styles.topAction}>
              <TouchableOpacity
                style={styles.createButton}
                onPress={() =>
                  setCreateModal(true)
                }
              >
                <Text style={styles.buttonText}>
                  + Create Item
                </Text>
              </TouchableOpacity>
            </View>

            {/* Products */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Items Stock
              </Text>

              {products.map((item) => (
                <View
                  key={item.id}
                  style={styles.productCard}
                >
                  <View
                    style={styles.productTop}
                  >
                    <View>
                      <Text
                        style={
                          styles.productName
                        }
                      >
                        {item.name}
                      </Text>

                      <Text
                        style={
                          styles.stockText
                        }
                      >
                        Stock: {item.stock}
                      </Text>
                    </View>

                    <View
                      style={
                        styles.stockBadge
                      }
                    >
                      <Text
                        style={
                          styles.stockBadgeText
                        }
                      >
                        {item.stock}
                      </Text>
                    </View>
                  </View>

                  {/* Recipe */}
                  <View
                    style={
                      styles.recipeContainer
                    }
                  >
                    {Object.entries(
                      item.recipe
                    ).map(([key, value]) => (
                      <View
                        key={key}
                        style={
                          styles.recipeItem
                        }
                      >
                        <Text
                          style={
                            styles.recipeKey
                          }
                        >
                          {key}
                        </Text>

                        <Text
                          style={
                            styles.recipeValue
                          }
                        >
                          {value}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity
                    style={
                      styles.manageButton
                    }
                    onPress={() =>
                      openStockModal(item)
                    }
                  >
                    <Text
                      style={styles.buttonText}
                    >
                      Manage Stock
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
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

export default Ready;

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

  topAction: {
    marginHorizontal: 20,
    marginBottom: 24,
  },

  createButton: {
    backgroundColor: "#38BDF8",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
  },

  section: {
    marginHorizontal: 20,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 18,
  },

  productCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
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

  productTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  productName: {
    fontSize: 19,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 6,
  },

  stockText: {
    color: "#64748B",
    fontSize: 14,
  },

  stockBadge: {
    backgroundColor: "#DDF6FF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
    alignSelf: "flex-start",
  },

  stockBadgeText: {
    color: "#0284C7",
    fontWeight: "700",
    fontSize: 16,
  },

  recipeContainer: {
    marginBottom: 18,
  },

  recipeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
  },

  recipeKey: {
    color: "#334155",
    fontWeight: "600",
  },

  recipeValue: {
    color: "#0284C7",
    fontWeight: "700",
  },

  manageButton: {
    backgroundColor: "#38BDF8",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.45)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  modalContainer: {
  backgroundColor: "#FFFFFF",
  borderRadius: 28,
  padding: 24,
  maxHeight: "85%",
  
},

  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 20,
  },

  selectedProduct: {
    color: "#0284C7",
    fontWeight: "700",
    marginBottom: 18,
    fontSize: 16,
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

  rawItemsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },

  rawButton: {
    backgroundColor: "#E2E8F0",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
  },

  rawButtonActive: {
    backgroundColor: "#38BDF8",
  },

  rawButtonText: {
    color: "#334155",
    fontWeight: "600",
  },

  rawButtonTextActive: {
    color: "#FFFFFF",
  },

  amountContainer: {
    marginBottom: 8,
  },

  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
    marginBottom: 50,
  },

  primaryButton: {
    flex: 1,
    backgroundColor: "#38BDF8",
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
  },

  secondaryButton: {
    flex: 1,
    backgroundColor: "#E2E8F0",
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
  },

  secondaryText: {
    color: "#334155",
    fontWeight: "700",
  },

  stockButtons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },

  addStockButton: {
    flex: 1,
    backgroundColor: "#38BDF8",
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
  },

  removeStockButton: {
    flex: 1,
    backgroundColor: "#0EA5E9",
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
  },

  cancelButton: {
    backgroundColor: "#E2E8F0",
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
});