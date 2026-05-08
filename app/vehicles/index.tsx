import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Alert,
} from "react-native";

const vehiclesData = [
  {
    id: "1",
    model: "Honda 125",
    number: "AB1234",
    cc: 125,
  },
  {
    id: "2",
    model: "Yamaha YBR",
    number: "CD5678",
    cc: 150,
  },
  {
    id: "3",
    model: "Suzuki GS",
    number: "EF9012",
    cc: 110,
  },
];

const ITEMS_PER_PAGE = 3;

const Index = () => {
  const [selectedVehicle, setSelectedVehicle] = useState(vehiclesData[0]);

  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  const [history, setHistory] = useState([
    {
      id: "1",
      vehicle: "Honda 125",
      amount: 5000,
      reason: "Maintenance",
      date: "2026-05-08",
      returned: false,
    },
    {
      id: "2",
      vehicle: "Yamaha YBR",
      amount: 2000,
      reason: "Fuel",
      date: "2026-05-07",
      returned: false,
    },
    {
      id: "3",
      vehicle: "Suzuki GS",
      amount: 3500,
      reason: "Tyre Change",
      date: "2026-05-06",
      returned: false,
    },
    {
      id: "4",
      vehicle: "Honda 125",
      amount: 1500,
      reason: "Oil Change",
      date: "2026-05-05",
      returned: false,
    },
  ]);

  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE);

  const paginatedHistory = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return history.slice(start, start + ITEMS_PER_PAGE);
  }, [history, page]);

  const handleCashout = () => {
    if (!amount || !reason) {
      Alert.alert("Missing Fields", "Please fill all fields.");
      return;
    }

    const newCashout = {
      id: Date.now().toString(),
      vehicle: selectedVehicle.model,
      amount: Number(amount),
      reason,
      date: new Date().toISOString().split("T")[0],
      returned: false,
    };

    setHistory([newCashout, ...history]);

    setAmount("");
    setReason("");

    Alert.alert("Success", "Cashout added successfully.");
  };

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#EAF7FF" />

      <FlatList
        ListHeaderComponent={
          <>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Vehicle Cashout System</Text>
              <Text style={styles.headerSubtitle}>
                Water Plant Management
              </Text>
            </View>

            {/* Vehicle List */}
            <Text style={styles.sectionTitle}>Select Vehicle</Text>

            {vehiclesData.map((vehicle) => {
              const active = selectedVehicle.id === vehicle.id;

              return (
                <TouchableOpacity
                  key={vehicle.id}
                  activeOpacity={0.8}
                  style={[
                    styles.vehicleCard,
                    active && styles.vehicleCardActive,
                  ]}
                  onPress={() => setSelectedVehicle(vehicle)}
                >
                  <View>
                    <Text style={styles.vehicleModel}>
                      {vehicle.model}
                    </Text>

                    <Text style={styles.vehicleText}>
                      Number: {vehicle.number}
                    </Text>

                    <Text style={styles.vehicleText}>
                      CC: {vehicle.cc}
                    </Text>
                  </View>

                  {active && (
                    <View style={styles.selectedBadge}>
                      <Text style={styles.selectedBadgeText}>Selected</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}

            {/* Cashout Form */}
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Cashout For Vehicle</Text>

              <Text style={styles.label}>Amount</Text>

              <TextInput
                placeholder="Enter amount"
                placeholderTextColor="#7B8794"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                style={styles.input}
              />

              <Text style={styles.label}>Reason</Text>

              <TextInput
                placeholder="Enter reason"
                placeholderTextColor="#7B8794"
                value={reason}
                onChangeText={setReason}
                multiline
                style={[styles.input, styles.reasonInput]}
              />

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.cashoutButton}
                  onPress={handleCashout}
                >
                  <Text style={styles.buttonText}>Cashout</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setAmount("");
                    setReason("");
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* History */}
            <View style={styles.historyContainer}>
              <Text style={styles.sectionTitle}>
                Vehicle Cashout History
              </Text>

              {paginatedHistory.map((item) => (
                <View key={item.id} style={styles.historyCard}>
                  <View style={styles.historyTop}>
                    <Text style={styles.historyVehicle}>
                      {item.vehicle}
                    </Text>

                    <Text style={styles.historyAmount}>
                      ₨ {item.amount}
                    </Text>
                  </View>

                  <Text style={styles.historyText}>
                    Reason: {item.reason}
                  </Text>

                  <Text style={styles.historyText}>
                    Date: {item.date}
                  </Text>

                  <TouchableOpacity
                    disabled={item.returned}
                    onPress={() => handleReturn(item.id)}
                    style={[
                      styles.returnButton,
                      item.returned && styles.returnedButton,
                    ]}
                  >
                    <Text style={styles.returnButtonText}>
                      {item.returned ? "Returned" : "Return"}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}

              {/* Pagination */}
              <View style={styles.paginationContainer}>
                <TouchableOpacity
                  disabled={page === 1}
                  onPress={() => setPage(page - 1)}
                  style={[
                    styles.paginationButton,
                    page === 1 && styles.disabledButton,
                  ]}
                >
                  <Text style={styles.paginationText}>Previous</Text>
                </TouchableOpacity>

                <Text style={styles.pageText}>
                  Page {page} of {totalPages}
                </Text>

                <TouchableOpacity
                  disabled={page === totalPages}
                  onPress={() => setPage(page + 1)}
                  style={[
                    styles.paginationButton,
                    page === totalPages && styles.disabledButton,
                  ]}
                >
                  <Text style={styles.paginationText}>Next</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        }
        data={[]}
        renderItem={null}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
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
    backgroundColor: "#D9F3FF",
    padding: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0F172A",
  },

  headerSubtitle: {
    marginTop: 6,
    color: "#475569",
    fontSize: 15,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E293B",
    marginHorizontal: 20,
    marginBottom: 14,
  },

  vehicleCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 14,
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,

    elevation: 3,
  },

  vehicleCardActive: {
    borderWidth: 2,
    borderColor: "#38BDF8",
    backgroundColor: "#F0FBFF",
  },

  vehicleModel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 6,
  },

  vehicleText: {
    color: "#475569",
    fontSize: 14,
    marginBottom: 2,
  },

  selectedBadge: {
    backgroundColor: "#38BDF8",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 30,
  },

  selectedBadgeText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 12,
  },

  formContainer: {
    backgroundColor: "#FFFFFF",
    margin: 20,
    borderRadius: 24,
    padding: 20,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,

    elevation: 3,
  },

  formTitle: {
    fontSize: 22,
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
    marginBottom: 18,
    color: "#0F172A",
    fontSize: 15,
  },

  reasonInput: {
    height: 100,
    textAlignVertical: "top",
  },

  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },

  cashoutButton: {
    flex: 1,
    backgroundColor: "#38BDF8",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },

  cancelButton: {
    flex: 1,
    backgroundColor: "#E2E8F0",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },

  cancelButtonText: {
    color: "#334155",
    fontWeight: "700",
    fontSize: 16,
  },

  historyContainer: {
    marginHorizontal: 20,
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
    marginBottom: 10,
  },

  historyVehicle: {
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
    color: "#475569",
    fontSize: 14,
    marginBottom: 6,
  },

  returnButton: {
    marginTop: 12,
    backgroundColor: "#38BDF8",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },

  returnedButton: {
    backgroundColor: "#94A3B8",
  },

  returnButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 40,
  },

  paginationButton: {
    backgroundColor: "#D9F3FF",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
  },

  disabledButton: {
    opacity: 0.4,
  },

  paginationText: {
    color: "#0369A1",
    fontWeight: "700",
  },

  pageText: {
    color: "#475569",
    fontWeight: "600",
  },
});