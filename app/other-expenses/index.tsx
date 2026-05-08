import React, { useMemo, useState } from "react";
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

const ITEMS_PER_PAGE = 4;

const Index = () => {
  const [expenses, setExpenses] = useState([
    {
      id: "1",
      name: "Electricity Bill",
    },
    {
      id: "2",
      name: "Generator Fuel",
    },
    {
      id: "3",
      name: "Water Supply",
    },
  ]);

  const [history, setHistory] = useState([]);

  const [page, setPage] = useState(1);

  // Add Expense Modal
  const [addModalVisible, setAddModalVisible] =
    useState(false);

  const [expenseName, setExpenseName] = useState("");

  // Pay Expense Modal
  const [payModalVisible, setPayModalVisible] =
    useState(false);

  const [selectedExpense, setSelectedExpense] =
    useState(null);

  const [amount, setAmount] = useState("");

  const totalPages = Math.max(
    1,
    Math.ceil(history.length / ITEMS_PER_PAGE)
  );

  const paginatedHistory = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;

    return history.slice(
      start,
      start + ITEMS_PER_PAGE
    );
  }, [history, page]);

  // Add Expense
  const handleAddExpense = () => {
    if (!expenseName.trim()) {
      Alert.alert(
        "Missing Name",
        "Please enter expense name."
      );
      return;
    }

    const newExpense = {
      id: Date.now().toString(),
      name: expenseName,
    };

    setExpenses([...expenses, newExpense]);

    setExpenseName("");

    setAddModalVisible(false);

    Alert.alert("Success", "Expense added.");
  };

  // Open Pay Modal
  const openPayModal = (expense) => {
    setSelectedExpense(expense);
    setPayModalVisible(true);
  };

  // Pay Expense
  const handlePayExpense = () => {
    if (!amount) {
      Alert.alert(
        "Missing Amount",
        "Please enter amount."
      );
      return;
    }

    const now = new Date();

    const newHistory = {
      id: Date.now().toString(),
      expense: selectedExpense.name,
      amount: Number(amount),
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),
      returned: false,
    };

    setHistory([newHistory, ...history]);

    setAmount("");

    setPayModalVisible(false);

    Alert.alert("Success", "Expense paid.");
  };

  // Return Payment
  const handleReturn = (id) => {
    const updated = history.map((item) =>
      item.id === id
        ? {
            ...item,
            returned: true,
          }
        : item
    );

    setHistory(updated);
  };

  // Delete Expense
  const handleDeleteExpense = (id) => {
    const updated = expenses.filter(
      (item) => item.id !== id
    );

    setExpenses(updated);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor="#DDF6FF"
        barStyle="dark-content"
      />

      {/* Add Expense Modal */}
      <Modal
        visible={addModalVisible}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Add Expense
            </Text>

            <Text style={styles.label}>
              Expense Name
            </Text>

            <TextInput
              placeholder="Enter expense name"
              placeholderTextColor="#94A3B8"
              value={expenseName}
              onChangeText={setExpenseName}
              style={styles.input}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleAddExpense}
              >
                <Text style={styles.buttonText}>
                  Add
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

      {/* Pay Expense Modal */}
      <Modal
        visible={payModalVisible}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Pay Expense
            </Text>

            <Text style={styles.selectedExpense}>
              {selectedExpense?.name}
            </Text>

            <Text style={styles.label}>Amount</Text>

            <TextInput
              placeholder="Enter amount"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              style={styles.input}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handlePayExpense}
              >
                <Text style={styles.buttonText}>
                  Pay
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() =>
                  setPayModalVisible(false)
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
                Expense Management
              </Text>

              <Text style={styles.headerSubtitle}>
                Water Plant Expense System
              </Text>
            </View>

            {/* Add Expense Button */}
            <View style={styles.topActionContainer}>
              <TouchableOpacity
                style={styles.addExpenseButton}
                onPress={() =>
                  setAddModalVisible(true)
                }
              >
                <Text style={styles.buttonText}>
                  + Add Expense
                </Text>
              </TouchableOpacity>
            </View>

            {/* Expense Items */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Expense Items
              </Text>

              {expenses.map((item) => (
                <View
                  key={item.id}
                  style={styles.expenseCard}
                >
                  <Text style={styles.expenseName}>
                    {item.name}
                  </Text>

                  <View style={styles.cardButtons}>
                    <TouchableOpacity
                      style={styles.payButton}
                      onPress={() =>
                        openPayModal(item)
                      }
                    >
                      <Text style={styles.buttonText}>
                        Pay
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() =>
                        handleDeleteExpense(
                          item.id
                        )
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

            {/* History */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Expense Pay History
              </Text>

              {paginatedHistory.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    No expense history yet
                  </Text>
                </View>
              ) : (
                paginatedHistory.map((item) => (
                  <View
                    key={item.id}
                    style={styles.historyCard}
                  >
                    <View
                      style={styles.historyTop}
                    >
                      <Text
                        style={
                          styles.historyExpense
                        }
                      >
                        {item.expense}
                      </Text>

                      <Text
                        style={styles.historyAmount}
                      >
                        ₨ {item.amount}
                      </Text>
                    </View>

                    <Text
                      style={styles.historyText}
                    >
                      Date: {item.date}
                    </Text>

                    <Text
                      style={styles.historyText}
                    >
                      Time: {item.time}
                    </Text>

                    <TouchableOpacity
                      disabled={item.returned}
                      onPress={() =>
                        handleReturn(item.id)
                      }
                      style={[
                        styles.returnButton,
                        item.returned &&
                          styles.returnedButton,
                      ]}
                    >
                      <Text
                        style={styles.buttonText}
                      >
                        {item.returned
                          ? "Returned"
                          : "Return"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}

              {/* Pagination */}
              {history.length > 0 && (
                <View
                  style={
                    styles.paginationContainer
                  }
                >
                  <TouchableOpacity
                    disabled={page === 1}
                    onPress={() =>
                      setPage(page - 1)
                    }
                    style={[
                      styles.paginationButton,
                      page === 1 &&
                        styles.disabledButton,
                    ]}
                  >
                    <Text
                      style={
                        styles.paginationText
                      }
                    >
                      Previous
                    </Text>
                  </TouchableOpacity>

                  <Text style={styles.pageText}>
                    {page} of {totalPages}
                  </Text>

                  <TouchableOpacity
                    disabled={
                      page === totalPages
                    }
                    onPress={() =>
                      setPage(page + 1)
                    }
                    style={[
                      styles.paginationButton,
                      page === totalPages &&
                        styles.disabledButton,
                    ]}
                  >
                    <Text
                      style={
                        styles.paginationText
                      }
                    >
                      Next
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
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

  topActionContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },

  addExpenseButton: {
    backgroundColor: "#38BDF8",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
  },

  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 16,
  },

  expenseCard: {
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

  expenseName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 16,
  },

  cardButtons: {
    flexDirection: "row",
    gap: 12,
  },

  payButton: {
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

  historyCard: {
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

  historyTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  historyExpense: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
  },

  historyAmount: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0284C7",
  },

  historyText: {
    color: "#64748B",
    marginBottom: 6,
  },

  returnButton: {
    backgroundColor: "#38BDF8",
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 14,
  },

  returnedButton: {
    backgroundColor: "#94A3B8",
  },

  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },

  paginationButton: {
    backgroundColor: "#DDF6FF",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
  },

  paginationText: {
    color: "#0369A1",
    fontWeight: "700",
  },

  pageText: {
    color: "#475569",
    fontWeight: "600",
  },

  disabledButton: {
    opacity: 0.4,
  },

  emptyContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },

  emptyText: {
    color: "#94A3B8",
    fontSize: 15,
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

  selectedExpense: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0284C7",
    marginBottom: 18,
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
    marginBottom: 20,
  },

  modalButtons: {
    flexDirection: "row",
    gap: 12,
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