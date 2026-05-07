import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  Modal,
  FlatList,
} from "react-native";
import { useEmployees } from "./context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const AddEmployeeModal = ({ visible, onClose, onSave, editingEmployee }) => {
  const [formData, setFormData] = useState(
    editingEmployee || {
      name: "",
      fatherName: "",
      address: "",
      cnic: "",
      salary: "",
      phone: "",
      position: "",
    }
  );

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.salary) {
      alert("Please fill required fields (Name and Salary)");
      return;
    }
    onSave(formData);
    onClose();
    setFormData({
      name: "",
      fatherName: "",
      address: "",
      cnic: "",
      salary: "",
      phone: "",
      position: "",
    });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingEmployee ? "Edit Employee" : "Add New Employee"}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#7F8C8D" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.name}
                onChangeText={(text) => handleChange("name", text)}
                placeholder="Enter employee name"
                placeholderTextColor="#BDC3C7"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Father Name</Text>
              <TextInput
                style={styles.textInput}
                value={formData.fatherName}
                onChangeText={(text) => handleChange("fatherName", text)}
                placeholder="Enter father's name"
                placeholderTextColor="#BDC3C7"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Position</Text>
              <TextInput
                style={styles.textInput}
                value={formData.position}
                onChangeText={(text) => handleChange("position", text)}
                placeholder="e.g., Sales Manager"
                placeholderTextColor="#BDC3C7"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.textInput}
                value={formData.phone}
                onChangeText={(text) => handleChange("phone", text)}
                placeholder="Enter phone number"
                placeholderTextColor="#BDC3C7"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Address</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={formData.address}
                onChangeText={(text) => handleChange("address", text)}
                placeholder="Enter complete address"
                placeholderTextColor="#BDC3C7"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>CNIC</Text>
              <TextInput
                style={styles.textInput}
                value={formData.cnic}
                onChangeText={(text) => handleChange("cnic", text)}
                placeholder="12345-6789012-3"
                placeholderTextColor="#BDC3C7"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Monthly Salary *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.salary.toString()}
                onChangeText={(text) => handleChange("salary", text)}
                placeholder="Enter salary amount"
                placeholderTextColor="#BDC3C7"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
                <Text style={styles.saveButtonText}>
                  {editingEmployee ? "Update" : "Add Employee"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const EmployeeCard = ({ employee, onPress, onReleaseSalary }) => {
  const pendingSalary = employee.salary - (employee.totalPaid || 0);
  
  return (
    <TouchableOpacity style={styles.employeeCard} onPress={() => onPress(employee)}>
      <View style={styles.cardHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{employee.name.charAt(0)}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.employeeName}>{employee.name}</Text>
          <Text style={styles.employeePosition}>{employee.position || "Staff"}</Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>Active</Text>
        </View>
      </View>

      <View style={styles.cardDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="cash-outline" size={16} color="#7F8C8D" />
          <Text style={styles.detailText}>Salary: ₨{employee.salary.toLocaleString()}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={16} color="#7F8C8D" />
          <Text style={styles.detailText}>Pending: ₨{pendingSalary.toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity 
          style={styles.releaseButton}
          onPress={() => onReleaseSalary(employee)}
        >
          <Ionicons name="gift-outline" size={18} color="#27AE60" />
          <Text style={styles.releaseButtonText}>Release Salary</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const SalaryModal = ({ visible, employee, onClose, onRelease }) => {
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  if (!employee) return null;

  const maxAmount = employee.salary - (employee.totalPaid || 0);

  const handleRelease = () => {
    const releaseAmount = parseFloat(amount);
    if (!releaseAmount || releaseAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    if (releaseAmount > maxAmount) {
      alert(`Amount cannot exceed pending salary of ₨${maxAmount}`);
      return;
    }
    onRelease(employee.id, releaseAmount, month, year);
    setAmount("");
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Release Salary</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#7F8C8D" />
            </TouchableOpacity>
          </View>

          <View style={styles.employeeInfo}>
            <Text style={styles.employeeInfoName}>{employee.name}</Text>
            <Text style={styles.employeeInfoSalary}>
              Monthly Salary: ₨{employee.salary.toLocaleString()}
            </Text>
            <Text style={styles.employeeInfoPending}>
              Pending: ₨{maxAmount.toLocaleString()}
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Amount to Release</Text>
            <TextInput
              style={styles.textInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="Enter amount"
              placeholderTextColor="#BDC3C7"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Month</Text>
            <View style={styles.pickerContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {months.map((m, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.monthOption,
                      month === idx + 1 && styles.monthOptionSelected,
                    ]}
                    onPress={() => setMonth(idx + 1)}
                  >
                    <Text
                      style={[
                        styles.monthText,
                        month === idx + 1 && styles.monthTextSelected,
                      ]}
                    >
                      {m}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleRelease}>
              <Text style={styles.saveButtonText}>Release Salary</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const index = () => {
  const {
    employees,
    showAddModal,
    setShowAddModal,
    editingEmployee,
    setEditingEmployee,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    releaseSalary,
    setSelectedEmployee,
  } = useEmployees();

  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [selectedEmployeeForSalary, setSelectedEmployeeForSalary] = useState(null);

  const handleAddEmployee = (employeeData) => {
    const salaryNum = parseFloat(employeeData.salary);
    addEmployee({ ...employeeData, salary: salaryNum });
  };

  const handleUpdateEmployee = (employeeData) => {
    const salaryNum = parseFloat(employeeData.salary);
    updateEmployee(editingEmployee.id, { ...employeeData, salary: salaryNum });
    setEditingEmployee(null);
  };

  const handleEmployeePress = (employee) => {
    setSelectedEmployee(employee);
    router.push("/employees/employee-details");
  };

  const handleReleaseSalary = (employee) => {
    setSelectedEmployeeForSalary(employee);
    setShowSalaryModal(true);
  };

  const handleSalaryRelease = (employeeId, amount, month, year) => {
    releaseSalary(employeeId, amount, month, year);
  };

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="people-outline" size={64} color="#BDC3C7" />
      <Text style={styles.emptyStateTitle}>No Employees Yet</Text>
      <Text style={styles.emptyStateText}>
        Tap the + button to add your first employee
      </Text>
    </View>
  );

  return (
    <>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}><TouchableOpacity onPress={()=>router.push('/(tabs)')}> <Ionicons name="arrow-back-outline" size={24} color='black' /> </TouchableOpacity> Employees</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => router.push("/employees/transactions")}
            >
              <Ionicons name="document-text-outline" size={24} color="#005B9F" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => {
                setEditingEmployee(null);
                setShowAddModal(true);
              }}
            >
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Summary */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{employees.length}</Text>
            <Text style={styles.statLabel}>Total Employees</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              ₨{employees.reduce((sum, e) => sum + (e.salary || 0), 0).toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>Monthly Payroll</Text>
          </View>
        </View>

        {/* Employee List */}
        <FlatList
          data={employees}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <EmployeeCard
              employee={item}
              onPress={handleEmployeePress}
              onReleaseSalary={handleReleaseSalary}
            />
          )}
          ListEmptyComponent={EmptyState}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Modals */}
      <AddEmployeeModal
        visible={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingEmployee(null);
        }}
        onSave={editingEmployee ? handleUpdateEmployee : handleAddEmployee}
        editingEmployee={editingEmployee}
      />

      <SalaryModal
        visible={showSalaryModal}
        employee={selectedEmployeeForSalary}
        onClose={() => setShowSalaryModal(false)}
        onRelease={handleSalaryRelease}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F9FD",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "white",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#7F8C8D",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#005B9F",
    display: 'flex',
    alignItems: 'center'
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E6F7FF",
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#005B9F",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#005B9F",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  statsContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  statCard: {
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
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#005B9F",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#7F8C8D",
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  employeeCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E6F7FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#005B9F",
  },
  cardInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
  },
  employeePosition: {
    fontSize: 13,
    color: "#7F8C8D",
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: "#27AE60",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    color: "white",
    fontWeight: "600",
  },
  cardDetails: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: "#7F8C8D",
  },
  cardActions: {
    borderTopWidth: 1,
    borderTopColor: "#ECF0F1",
    paddingTop: 12,
  },
  releaseButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 8,
    backgroundColor: "#F0FFF4",
    borderRadius: 8,
  },
  releaseButtonText: {
    color: "#27AE60",
    fontWeight: "600",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
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
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: "#7F8C8D",
    marginBottom: 6,
    fontWeight: "500",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E0F0FF",
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    backgroundColor: "#F8FAFC",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#ECF0F1",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#7F8C8D",
    fontWeight: "600",
  },
  saveButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#005B9F",
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "600",
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
  employeeInfo: {
    backgroundColor: "#F4F9FD",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  employeeInfoName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C3E50",
  },
  employeeInfoSalary: {
    fontSize: 14,
    color: "#7F8C8D",
    marginTop: 4,
  },
  employeeInfoPending: {
    fontSize: 14,
    color: "#27AE60",
    marginTop: 2,
    fontWeight: "500",
  },
  pickerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  monthOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#ECF0F1",
    marginRight: 8,
  },
  monthOptionSelected: {
    backgroundColor: "#005B9F",
  },
  monthText: {
    fontSize: 12,
    color: "#7F8C8D",
  },
  monthTextSelected: {
    color: "white",
  },
});

export default index;