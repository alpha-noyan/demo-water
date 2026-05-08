import React, { useState } from "react";
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

const Transactions = () => {
  const [transactions, setTransactions] =
    useState([
      {
        id: "1",
        item: "Cap",
        amount: 5000,
        quantity: 200,
        type: "Inbound",
        date: "08 May 2026",
        time: "10:45 AM",
        returned: false,
      },
      {
        id: "2",
        item: "Bottle",
        amount: 12000,
        quantity: 500,
        type: "Inbound",
        date: "08 May 2026",
        time: "01:20 PM",
        returned: false,
      },
      {
        id: "3",
        item: "Label",
        amount: 3500,
        quantity: 150,
        type: "Outbound",
        date: "07 May 2026",
        time: "04:10 PM",
        returned: false,
      },
      {
        id: "4",
        item: "Plastic Wrapper",
        amount: 6500,
        quantity: 300,
        type: "Inbound",
        date: "06 May 2026",
        time: "11:30 AM",
        returned: false,
      },
    ]);

  // Return Transaction
  const handleReturn = (id) => {
    const updated = transactions.map((item) =>
      item.id === id
        ? {
            ...item,
            returned: true,
          }
        : item
    );

    setTransactions(updated);

    Alert.alert(
      "Returned",
      "Transaction returned successfully."
    );
  };

  const renderTransaction = ({ item }) => {
    return (
      <View style={styles.card}>
        {/* Top */}
        <View style={styles.cardTop}>
          <View>
            <Text style={styles.itemName}>
              {item.item}
            </Text>

            <Text style={styles.typeText}>
              {item.type} Transaction
            </Text>
          </View>

          <View style={styles.amountBadge}>
            <Text style={styles.amountText}>
              ₨ {item.amount}
            </Text>
          </View>
        </View>

        {/* Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              Quantity
            </Text>

            <Text style={styles.detailValue}>
              {item.quantity}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              Date
            </Text>

            <Text style={styles.detailValue}>
              {item.date}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              Time
            </Text>

            <Text style={styles.detailValue}>
              {item.time}
            </Text>
          </View>
        </View>

        {/* Button */}
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
          <Text style={styles.buttonText}>
            {item.returned
              ? "Returned"
              : "Return"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor="#DDF6FF"
        barStyle="dark-content"
      />

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={renderTransaction}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
        }}
        ListHeaderComponent={
          <>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>
                Transactions
              </Text>

              <Text style={styles.headerSubtitle}>
                Stock transaction history
              </Text>
            </View>

            {/* Section */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Recent Transactions
              </Text>

              <Text style={styles.transactionCount}>
                {transactions.length} Records
              </Text>
            </View>
          </>
        }
      />
    </SafeAreaView>
  );
};

export default Transactions;

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

  sectionHeader: {
    marginHorizontal: 20,
    marginBottom: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
  },

  transactionCount: {
    color: "#0284C7",
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 18,
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

  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  itemName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },

  typeText: {
    color: "#64748B",
    fontSize: 14,
  },

  amountBadge: {
    backgroundColor: "#DDF6FF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },

  amountText: {
    color: "#0284C7",
    fontWeight: "700",
    fontSize: 16,
  },

  detailsContainer: {
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    padding: 14,
    marginBottom: 18,
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  detailLabel: {
    color: "#64748B",
    fontWeight: "600",
  },

  detailValue: {
    color: "#0F172A",
    fontWeight: "700",
  },

  returnButton: {
    backgroundColor: "#38BDF8",
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
  },

  returnedButton: {
    backgroundColor: "#94A3B8",
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
});