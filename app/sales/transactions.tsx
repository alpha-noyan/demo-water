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
        clientName: "John Doe",
        clientAddress: "Main Bazar, Peshawar",
        amount: 5000,
        date: "08 May 2026",
        time: "10:30 AM",
        delivery: true,
        deliveryPerson: "Ali Khan",
        commission: 300,
        returned: false,
      },
      {
        id: "2",
        clientName: "Ahmed Traders",
        clientAddress: "University Road",
        amount: 12500,
        date: "08 May 2026",
        time: "01:20 PM",
        delivery: false,
        deliveryPerson: "",
        commission: 0,
        returned: false,
      },
      {
        id: "3",
        clientName: "Usman Store",
        clientAddress: "Charsadda Road",
        amount: 8400,
        date: "07 May 2026",
        time: "04:45 PM",
        delivery: true,
        deliveryPerson: "Hamza",
        commission: 500,
        returned: false,
      },
      {
        id: "4",
        clientName: "Bilal Market",
        clientAddress: "Ring Road",
        amount: 15000,
        date: "06 May 2026",
        time: "09:15 AM",
        delivery: true,
        deliveryPerson: "Sajid",
        commission: 700,
        returned: false,
      },
    ]);

  // Return Invoice
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
      "Invoice returned successfully."
    );
  };

  const renderTransaction = ({ item }) => {
    return (
      <View style={styles.card}>
        {/* Top */}
        <View style={styles.topRow}>
          <View>
            <Text style={styles.clientName}>
              {item.clientName}
            </Text>

            <Text style={styles.address}>
              {item.clientAddress}
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
            <Text style={styles.label}>
              Date
            </Text>

            <Text style={styles.value}>
              {item.date}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>
              Time
            </Text>

            <Text style={styles.value}>
              {item.time}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>
              Delivery
            </Text>

            <Text style={styles.value}>
              {item.delivery
                ? "Yes"
                : "No"}
            </Text>
          </View>

          {item.delivery && (
            <>
              <View
                style={styles.detailRow}
              >
                <Text
                  style={styles.label}
                >
                  Delivery Person
                </Text>

                <Text
                  style={styles.value}
                >
                  {
                    item.deliveryPerson
                  }
                </Text>
              </View>

              <View
                style={styles.detailRow}
              >
                <Text
                  style={styles.label}
                >
                  Commission
                </Text>

                <Text
                  style={styles.value}
                >
                  ₨ {item.commission}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Return Button */}
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
              : "Return Invoice"}
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
                Sales Transactions
              </Text>

              <Text style={styles.headerSubtitle}>
                Invoice and delivery history
              </Text>
            </View>

            {/* Section */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Recent Invoices
              </Text>

              <Text style={styles.countText}>
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

  countText: {
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

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  clientName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },

  address: {
    color: "#64748B",
    fontSize: 14,
    maxWidth: 220,
  },

  amountBadge: {
    backgroundColor: "#DDF6FF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    alignSelf: "flex-start",
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

  label: {
    color: "#64748B",
    fontWeight: "600",
  },

  value: {
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