import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  FlatList,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { createRawItem, fetchRawItems, updateRawItem, deleteRawItem } from "../../db/stock";

const Raw = () => {
  const [rawItems, setRawItems] = useState([
    {
      id: "1",
      name: "Bottle Caps",
      quantity: 10,
    },
    {
      id: "2",
      name: "Mineral Water Bottles",
      quantity: 5,
    },
    {
      id: "3",
      name: "Plastic Wrappers",
      quantity: 15,
    },
  ]);

  useEffect(() => {
    const loadRawItems = async () => {
      try {
        const items = await fetchRawItems();
        setRawItems(items);
      } catch (error) {
        console.error("Error fetching raw items:", error);
        Alert.alert(
          "Error",
          "An error occurred while fetching raw items."
        );
      }
    };

    loadRawItems();
  }, []);

  // Add Modal
  const [addModalVisible, setAddModalVisible] =
    useState(false);

  const [itemName, setItemName] = useState("");

  const [quantity, setQuantity] = useState("");

  // Edit Modal
  const [editModalVisible, setEditModalVisible] =
    useState(false);

  const [selectedItem, setSelectedItem] =
    useState(null);

  const [editName, setEditName] = useState("");
  const [editId, setEditId] = useState(null);

  const [editQuantity, setEditQuantity] =
    useState("");

  // Add Raw Item
  const handleAddItem = async () => {
    try {
      if (!itemName.trim() || !quantity) {
      Alert.alert(
        "Missing Fields",
        "Please fill all fields."
      );

      return;
    }

    
      await createRawItem(itemName, Number(quantity));

    const newItem = {
      id: Date.now().toString(),
      name: itemName,
      quantity: Number(quantity),
    };

    setRawItems([...rawItems, newItem]);

    setItemName("");
    setQuantity("");

    setAddModalVisible(false);

    Alert.alert("Success", "Raw item added.");

    } catch (error) {
      console.error("Error adding raw item:", error);
      Alert.alert(
        "Error",
        "An error occurred while adding the raw item."
      );
    }

    
  };

  // Open Edit Modal
  const handleEditOpen = (item) => {
    setSelectedItem(item);

    console.log("Selected Item for Edit:", item);

    setEditName(item.name);

    setEditQuantity(item.quantity.toString());

    setEditId(item.id);

    setEditModalVisible(true);
  };

  // Save Edit
  const handleSaveEdit = async () => {
    try {
    if (!editName.trim() || !editQuantity) {
      Alert.alert(
        "Missing Fields",
        "Please fill all fields."
      );

      return;
    }

    await updateRawItem(editId, editName, Number(editQuantity));

    const updated = rawItems.map((item) =>
      item.id === selectedItem.id
        ? {
            ...item,
            name: editName,
            quantity: Number(editQuantity),
          }
        : item
    );

    setRawItems(updated);

    setEditModalVisible(false);

    setSelectedItem(null);
    setEditName("");
    setEditQuantity("");
    setEditId(null);

    Alert.alert(
      "Updated",
      "Raw item updated successfully."
    );
  } catch (error) {
    console.error("Error updating raw item:", error);
    Alert.alert(
      "Error",
      "An error occurred while updating the raw item."
    );
  };
}

  // Delete Item
  const handleDelete = async (id) => {
    try {
      await deleteRawItem(id);
      const updated = rawItems.filter((item) => item.id !== id);
      setRawItems(updated);
    } catch (error) {
      console.error("Error deleting raw item:", error);
      Alert.alert(
        "Error",
        "An error occurred while deleting the raw item."
      );
    }
  };

  

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor="#DDF6FF"
        barStyle="dark-content"
      />

      {/* Add Modal */}
      <Modal
        visible={addModalVisible}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Add Raw Item
            </Text>

            <Text style={styles.label}>
              Raw Item Name
            </Text>

            <TextInput
              placeholder="Enter raw item name"
              placeholderTextColor="#94A3B8"
              value={itemName}
              onChangeText={setItemName}
              style={styles.input}
            />

            <Text style={styles.label}>
              Quantity
            </Text>

            <TextInput
              placeholder="Enter quantity"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
              style={styles.input}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleAddItem}
              >
                <Text style={styles.buttonText}>
                  Add Item
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() =>
                  setAddModalVisible(false)
                }
              >
                <Text style={styles.secondaryText}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Edit Raw Item
            </Text>

            <Text style={styles.label}>
              Raw Item Name
            </Text>

            <TextInput
              placeholder="Enter raw item name"
              placeholderTextColor="#94A3B8"
              value={editName}
              onChangeText={setEditName}
              style={styles.input}
            />

            <Text style={styles.label}>
              Quantity
            </Text>

            <TextInput
              placeholder="Enter quantity"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={editQuantity}
              onChangeText={setEditQuantity}
              style={styles.input}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleSaveEdit}
              >
                <Text style={styles.buttonText}>
                  Save
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() =>
                  setEditModalVisible(false)
                }
              >
                <Text style={styles.secondaryText}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
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
                Raw Items
              </Text>

              <Text style={styles.headerSubtitle}>
                Water Plant Raw Material Management
              </Text>
            </View>

            {/* Add Button */}
            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() =>
                  setAddModalVisible(true)
                }
              >
                <Text style={styles.buttonText}>
                  + Add Raw Item
                </Text>
              </TouchableOpacity>
            </View>

            {/* Raw Items */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Available Raw Items
              </Text>

              {rawItems.map((item) => (
                <View
                  key={item.id}
                  style={styles.itemCard}
                >
                  <View style={styles.cardTop}>
                    <Text style={styles.itemName}>
                      {item.name}
                    </Text>

                    <View style={styles.quantityBox}>
                      <Text
                        style={styles.quantityText}
                      >
                        {item.quantity}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.itemSubText}>
                    Quantity Available
                  </Text>

                  <View style={styles.cardButtons}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() =>
                        handleEditOpen(item)
                      }
                    >
                      <Text style={styles.buttonText}>
                        Edit
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() =>
                        handleDelete(item.id)
                      }
                    >
                      <Text
                        style={
                          styles.deleteButtonText
                        }
                      >
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </View>
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

export default Raw;

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
    fontSize: 28,
    fontWeight: "700",
    color: "#0F172A",
  },

  headerSubtitle: {
    marginTop: 6,
    color: "#64748B",
    fontSize: 15,
  },

  actionContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },

  addButton: {
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

  itemCard: {
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

  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  itemName: {
    fontSize: 19,
    fontWeight: "700",
    color: "#0F172A",
    flex: 1,
    marginRight: 12,
  },

  quantityBox: {
    backgroundColor: "#DDF6FF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
  },

  quantityText: {
    color: "#0284C7",
    fontWeight: "700",
    fontSize: 16,
  },

  itemSubText: {
    color: "#64748B",
    marginBottom: 18,
    fontSize: 14,
  },

  cardButtons: {
    flexDirection: "row",
    gap: 12,
  },

  editButton: {
    flex: 1,
    backgroundColor: "#38BDF8",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  deleteButton: {
    flex: 1,
    backgroundColor: "#E2E8F0",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  deleteButtonText: {
    color: "#334155",
    fontWeight: "700",
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
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 20,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
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

  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 6,
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

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
});