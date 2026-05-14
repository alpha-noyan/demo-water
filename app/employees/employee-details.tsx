import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useEmployees } from "./context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function EmployeeDetails() {
  const { selectedEmployee, deleteEmployee, getEmployeeTransactions, releaseSalary } = useEmployees();
  const [showSalaryModal, setShowSalaryModal] = React.useState(false);
  const employee = selectedEmployee;

  if (!employee) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No employee selected</Text>
      </View>
    );
  }

  const transactions = getEmployeeTransactions(employee.id);
  const totalPaid = employee.totalPaid || 0;
  const pendingSalary = employee.salary - totalPaid;

  const handleDelete = () => {
    deleteEmployee(employee.id);
    router.back();
  };

  const handleEdit = () => {
    // Navigate to edit screen or open modal
    Alert.alert("Edit", "Edit functionality coming soon");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#005B9F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Employee Details</Text>
        <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
          <Ionicons name="pencil" size={20} color="#005B9F" />
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{employee.name.charAt(0)}</Text>
        </View>
        <Text style={styles.employeeName}>{employee.name}</Text>
        <Text style={styles.employeePosition}>{employee.position || "Staff Member"}</Text>
        <View style={styles.statusContainer}>
          <View style={styles.activeBadge}>
            <Text style={styles.activeText}>Active</Text>
          </View>
        </View>
      </View>

      {/* Personal Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={20} color="#7F8C8D" />
          <Text style={styles.infoLabel}>Father Name:</Text>
          <Text style={styles.infoValue}>{employee.fatherName || "N/A"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="call-outline" size={20} color="#7F8C8D" />
          <Text style={styles.infoLabel}>Phone:</Text>
          <Text style={styles.infoValue}>{employee.phone || "N/A"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={20} color="#7F8C8D" />
          <Text style={styles.infoLabel}>Address:</Text>
          <Text style={styles.infoValue}>{employee.address || "N/A"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="card-outline" size={20} color="#7F8C8D" />
          <Text style={styles.infoLabel}>CNIC:</Text>
          <Text style={styles.infoValue}>{employee.cnic || "N/A"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={20} color="#7F8C8D" />
          <Text style={styles.infoLabel}>Joining Date:</Text>
          <Text style={styles.infoValue}>{formatDate(employee.date_of_joining)}</Text>
        </View>
      </View>

      {/* Financial Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Financial Information</Text>
        <View style={styles.financialCard}>
          <View style={styles.financialRow}>
            <Text style={styles.financialLabel}>Monthly Salary</Text>
            <Text style={styles.financialValue}>₨{employee.salary.toLocaleString()}</Text>
          </View>
          <View style={styles.financialRow}>
            <Text style={styles.financialLabel}>Total Paid</Text>
            <Text style={styles.financialValue}>₨{totalPaid.toLocaleString()}</Text>
          </View>
          <View style={styles.financialRow}>
            <Text style={styles.financialLabel}>Pending Salary</Text>
            <Text style={[styles.financialValue, styles.pendingValue]}>
              ₨{pendingSalary.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>

      {/* Transaction History */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Salary History</Text>
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => router.push("/employees/transactions")}
          >
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        {transactions.length === 0 ? (
          <View style={styles.emptyTransactions}>
            <Text style={styles.emptyText}>No salary releases yet</Text>
          </View>
        ) : (
          transactions.slice(0, 3).map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View>
                <Text style={styles.transactionAmount}>
                  ₨{transaction.amount.toLocaleString()}
                </Text>
                <Text style={styles.transactionDate}>
                  {new Date(transaction.date).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.transactionStatus}>
                <Text style={styles.statusCompleted}>Completed</Text>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.releaseButton}
          onPress={() => {
            if (pendingSalary > 0) {
              setShowSalaryModal(true);
            } else {
              Alert.alert("No Pending Salary", "All salary has been paid");
            }
          }}
        >
          <Ionicons name="gift-outline" size={20} color="white" />
          <Text style={styles.releaseButtonText}>Release Salary</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={20} color="#E74C3C" />
          <Text style={styles.deleteButtonText}>Delete Employee</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

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
  editButton: {
    padding: 8,
  },
  profileSection: {
    backgroundColor: "white",
    alignItems: "center",
    padding: 24,
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E6F7FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: "600",
    color: "#005B9F",
  },
  employeeName: {
    fontSize: 24,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 4,
  },
  employeePosition: {
    fontSize: 14,
    color: "#7F8C8D",
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: "row",
  },
  activeBadge: {
    backgroundColor: "#27AE60",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  section: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    flexWrap: "wrap",
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#7F8C8D",
    marginLeft: 8,
    width: 90,
  },
  infoValue: {
    fontSize: 14,
    color: "#2C3E50",
    flex: 1,
  },
  financialCard: {
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: 12,
  },
  financialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  financialLabel: {
    fontSize: 14,
    color: "#7F8C8D",
  },
  financialValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C3E50",
  },
  pendingValue: {
    color: "#27AE60",
    fontSize: 16,
  },
  viewAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  viewAllText: {
    fontSize: 12,
    color: "#005B9F",
    fontWeight: "500",
  },
  emptyTransactions: {
    padding: 24,
    alignItems: "center",
  },
  emptyText: {
    color: "#BDC3C7",
    fontSize: 14,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ECF0F1",
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#27AE60",
  },
  transactionDate: {
    fontSize: 12,
    color: "#7F8C8D",
    marginTop: 2,
  },
  transactionStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#F0FFF4",
    borderRadius: 6,
  },
  statusCompleted: {
    fontSize: 11,
    color: "#27AE60",
    fontWeight: "500",
  },
  actionButtons: {
    padding: 16,
    paddingBottom: 32,
    gap: 12,
  },
  releaseButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#005B9F",
    padding: 16,
    borderRadius: 12,
  },
  releaseButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FEF2F2",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  deleteButtonText: {
    color: "#E74C3C",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    fontSize: 16,
    color: "#E74C3C",
    textAlign: "center",
    marginTop: 40,
  },
});