import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";

const wasooliData = [
  {
    id: "1",
    title: "Water Supply Payment",
    amount: 1000,
    from: "John Doe",
    date: "2026-05-08",
    received: false,
  },
  {
    id: "2",
    title: "Office Delivery",
    amount: 2500,
    from: "Ali Khan",
    date: "2026-05-07",
    received: false,
  },
  {
    id: "3",
    title: "Plant Maintenance",
    amount: 1800,
    from: "Ahmed Raza",
    date: "2026-05-06",
    received: false,
  },
  {
    id: "4",
    title: "Bottle Supply",
    amount: 3200,
    from: "Usman Tariq",
    date: "2026-05-05",
    received: false,
  },
  {
    id: "5",
    title: "Monthly Recovery",
    amount: 4200,
    from: "Hamza Noor",
    date: "2026-05-04",
    received: false,
  },
  {
    id: "6",
    title: "Retail Shop Recovery",
    amount: 1500,
    from: "Bilal Ahmed",
    date: "2026-05-03",
    received: false,
  },
];

const ITEMS_PER_PAGE = 3;

const Index = () => {
  const [wasoolis, setWasoolis] = useState(wasooliData);

  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(wasoolis.length / ITEMS_PER_PAGE);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return wasoolis.slice(start, start + ITEMS_PER_PAGE);
  }, [page, wasoolis]);

  const handleReceived = (id) => {
    const updated = wasoolis.map((item) =>
      item.id === id
        ? {
            ...item,
            received: true,
          }
        : item
    );

    setWasoolis(updated);

    Alert.alert("Success", "Payment marked as received.");
  };

  const pendingCount = wasoolis.filter(
    (item) => !item.received
  ).length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#DDF6FF" barStyle="dark-content" />

      <FlatList
        data={[]}
        renderItem={null}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>
                Wasooli Management
              </Text>

              <Text style={styles.headerSubtitle}>
                Water Plant Recovery Dashboard
              </Text>
            </View>

            {/* Summary Cards */}
            <View style={styles.summaryRow}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryNumber}>
                  {wasoolis.length}
                </Text>

                <Text style={styles.summaryText}>
                  Total Wasoolis
                </Text>
              </View>

              <View style={styles.summaryCard}>
                <Text style={styles.summaryNumber}>
                  {pendingCount}
                </Text>

                <Text style={styles.summaryText}>
                  Pending
                </Text>
              </View>
            </View>

            {/* Section */}
            <Text style={styles.sectionTitle}>
              Pending Wasoolis
            </Text>

            {/* Cards */}
            {paginatedData.map((item) => (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <Text style={styles.cardTitle}>
                    {item.title}
                  </Text>

                  <Text style={styles.amount}>
                    ₨ {item.amount}
                  </Text>
                </View>

                <View style={styles.infoContainer}>
                  <Text style={styles.infoText}>
                    From: {item.from}
                  </Text>

                  <Text style={styles.infoText}>
                    Date: {item.date}
                  </Text>
                </View>

                <TouchableOpacity
                  disabled={item.received}
                  onPress={() => handleReceived(item.id)}
                  style={[
                    styles.button,
                    item.received && styles.buttonReceived,
                  ]}
                >
                  <Text style={styles.buttonText}>
                    {item.received
                      ? "Received"
                      : "Mark as Received"}
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
                <Text style={styles.paginationText}>
                  Back
                </Text>
              </TouchableOpacity>

              <Text style={styles.pageText}>
                {page} of {totalPages}
              </Text>

              <TouchableOpacity
                disabled={page === totalPages}
                onPress={() => setPage(page + 1)}
                style={[
                  styles.paginationButton,
                  page === totalPages &&
                    styles.disabledButton,
                ]}
              >
                <Text style={styles.paginationText}>
                  Next
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
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0F172A",
  },

  headerSubtitle: {
    marginTop: 6,
    fontSize: 15,
    color: "#475569",
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 24,
    gap: 14,
  },

  summaryCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingVertical: 24,
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

  summaryNumber: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0284C7",
  },

  summaryText: {
    marginTop: 6,
    color: "#64748B",
    fontSize: 14,
    fontWeight: "600",
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
    marginHorizontal: 20,
    marginBottom: 16,
  },

  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 16,
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

  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    flex: 1,
    marginRight: 10,
  },

  amount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0284C7",
  },

  infoContainer: {
    marginBottom: 16,
  },

  infoText: {
    color: "#475569",
    fontSize: 14,
    marginBottom: 6,
  },

  button: {
    backgroundColor: "#38BDF8",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },

  buttonReceived: {
    backgroundColor: "#94A3B8",
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },

  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },

  paginationButton: {
    backgroundColor: "#DDF6FF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },

  disabledButton: {
    opacity: 0.4,
  },

  paginationText: {
    color: "#0369A1",
    fontWeight: "700",
    fontSize: 14,
  },

  pageText: {
    color: "#475569",
    fontWeight: "600",
    fontSize: 15,
  },
});