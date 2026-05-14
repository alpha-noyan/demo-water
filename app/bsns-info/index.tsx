import { View, Text, TouchableOpacity, TextInput, Modal, StyleSheet, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { useBsns } from "./context";
import { Ionicons } from '@expo/vector-icons';

const BusinessInfoScreen = () => {
  const { info, popup, setPopup, addAmount, withdrawAmount, changeName, setIsEditing, isEditing } = useBsns();
  const [addingInfo, setAddingInfo] = useState({
    name: "",
    amount: "",
    type: "credit",
  });
  const [editName, setEditName] = useState(info.name);

  function handleChange(field, value) {
    setAddingInfo((prev) => ({
      ...prev,
      [field]: field === "amount" ? value : value,
    }));
  }

  function handleAddCash() {
    const success = addAmount(Number(addingInfo.amount), addingInfo.name);
    if (success) {
      setAddingInfo({ name: "", amount: "", type: "credit" });
      setPopup(false);
    }
  }

  function handleWithdraw() {
    const success = withdrawAmount(Number(addingInfo.amount), addingInfo.name);
    if (success) {
      setAddingInfo({ name: "", amount: "", type: "credit" });
      setPopup(false);
    }
  }

  function handleUpdateName() {
    if (changeName(editName)) {
      setIsEditing(false);
    }
  }

  const formatAmount = (amount) => {
    return `${info.currency}${amount.toLocaleString()}`;
  };

  return (
    <>
      <ScrollView style={styles.container}>
        {/* Business Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="business-outline" size={24} color="#005B9F" />
            <Text style={styles.sectionTitle}>Business Information</Text>
          </View>
          
          {/* Business Name Section */}
          <View style={styles.infoRow}>
            <Text style={styles.label}>Business Name</Text>
            {isEditing ? (
              <View style={styles.editContainer}>
                <TextInput
                  style={styles.input}
                  value={editName}
                  onChangeText={setEditName}
                  autoFocus
                />
                <TouchableOpacity onPress={handleUpdateName} style={styles.saveButton}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.nameContainer}>
                <Text style={styles.businessName}>{info.name}</Text>
                <Ionicons name="pencil-outline" size={18} color="#7F8C8D" />
              </TouchableOpacity>
            )}
          </View>

          {/* Amount Section */}
          <View style={styles.amountContainer}>
            <Text style={styles.label}>Current Balance</Text>
            <Text style={styles.amount}>{formatAmount(info?.current_amount)}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsCard}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.addButton]} 
              onPress={() => setPopup(true)}
            >
              <Ionicons name="add-circle-outline" size={24} color="white" />
              <Text style={styles.buttonText}>Add Cash</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.transactionButton]} 
              onPress={() => router.push("/bsns-info/transactions")}
            >
              <Ionicons name="list-outline" size={24} color="white" />
              <Text style={styles.buttonText}>Transactions</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>

      {/* Add/Withdraw Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={popup}
        onRequestClose={() => setPopup(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Cash</Text>
              <TouchableOpacity onPress={() => setPopup(false)}>
                <Ionicons name="close" size={24} color="#7F8C8D" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={(text) => handleChange("name", text)}
                value={addingInfo.name}
                placeholder="Enter name or description"
                placeholderTextColor="#BDC3C7"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Amount ({info.currency})</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                onChangeText={(text) => handleChange("amount", text)}
                value={addingInfo.amount}
                placeholder="Enter amount"
                placeholderTextColor="#BDC3C7"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelModalButton]} 
                onPress={() => setPopup(false)}
              >
                <Text style={styles.cancelModalButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmModalButton]} 
                onPress={handleAddCash}
              >
                <Text style={styles.confirmModalButtonText}>Add Cash</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F9FD",
  },
  infoCard: {
    backgroundColor: "white",
    borderRadius: 20,
    margin: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C3E50",
  },
  infoRow: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#7F8C8D",
    marginBottom: 8,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  businessName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2C3E50",
  },
  editContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E0F0FF",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#F8FAFC",
  },
  saveButton: {
    backgroundColor: "#005B9F",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "#E74C3C",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "600",
  },
  amountContainer: {
    marginTop: 10,
  },
  amount: {
    fontSize: 36,
    fontWeight: "700",
    color: "#005B9F",
  },
  actionsCard: {
    backgroundColor: "white",
    borderRadius: 20,
    margin: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 15,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 12,
    gap: 8,
  },
  addButton: {
    backgroundColor: "#27AE60",
  },
  transactionButton: {
    backgroundColor: "#005B9F",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  recentCard: {
    backgroundColor: "white",
    borderRadius: 20,
    margin: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 15,
  },
  viewAllText: {
    fontSize: 16,
    color: "#005B9F",
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2C3E50",
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: "#7F8C8D",
    marginBottom: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E0F0FF",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#F8FAFC",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelModalButton: {
    backgroundColor: "#ECF0F1",
  },
  cancelModalButtonText: {
    color: "#7F8C8D",
    fontWeight: "600",
  },
  confirmModalButton: {
    backgroundColor: "#27AE60",
  },
  confirmModalButtonText: {
    color: "white",
    fontWeight: "600",
  },
});

export default BusinessInfoScreen;