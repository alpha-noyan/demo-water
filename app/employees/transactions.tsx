import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useEmployees } from "./context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const TransactionsScreen = () => {
  const { transactions, employees } = useEmployees();

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.name : "Unknown";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const formatAmount = (amount) => {
    return `₨${amount.toLocaleString()}`;
  };

  const getMonthName = (month) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[month - 1];
  };

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionHeader}>
        <View style={styles.employeeInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getEmployeeName(item.employeeId).charAt(0)}</Text>
          </View>
          <View>
            <Text style={styles.employeeName}>{getEmployeeName(item.employeeId)}</Text>
            <Text style={styles.transactionDate}>{formatDate(item.date)}</Text>
          </View>
        </View>
        <View style={styles.amountContainer}>
          <Text style={styles.amount}>-{formatAmount(item.amount)}</Text>
          <Text style={styles.month}>
            {getMonthName(item.month)} {item.year}
          </Text>
        </View>
      </View>
      <View style={styles.transactionFooter}>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>Salary Released</Text>
        </View>
      </View>
    </View>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="document-text-outline" size={64} color="#BDC3C7" />
      <Text style={styles.emptyStateTitle}>No Transactions Yet</Text>
      <Text style={styles.emptyStateText}>
        Release salaries to see transaction history
      </Text>
    </View>
  );

  const SummaryHeader = () => {
    const totalReleased = transactions.reduce((sum, t) => sum + t.amount, 0);
    
    return (
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Transactions</Text>
          <Text style={styles.summaryNumber}>{transactions.length}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Released</Text>
          <Text style={styles.summaryAmount}>{formatAmount(totalReleased)}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#005B9F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Salary Transactions</Text>
        <View style={{ width: 40 }} />
      </View>

      <SummaryHeader />

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTransaction}
        ListEmptyComponent={EmptyState}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F9FD",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "white",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2C3E50",
  },
  summaryContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#7F8C8D",
    marginBottom: 4,
  },
  summaryNumber: {
    fontSize: 28,
    fontWeight: "700",
    color: "#005B9F",
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: "700",
    color: "#27AE60",
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  transactionCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  employeeInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E6F7FF",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#005B9F",
  },
  employeeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
  },
  transactionDate: {
    fontSize: 12,
    color: "#7F8C8D",
    marginTop: 2,
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#E74C3C",
  },
  month: {
    fontSize: 11,
    color: "#7F8C8D",
    marginTop: 2,
  },
  transactionFooter: {
    borderTopWidth: 1,
    borderTopColor: "#ECF0F1",
    paddingTop: 12,
  },
  statusBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#F0FFF4",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    color: "#27AE60",
    fontWeight: "500",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C3E50",
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#7F8C8D",
    marginTop: 8,
    textAlign: "center",
  },
});

export default TransactionsScreen;