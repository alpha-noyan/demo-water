import { createContext, useState, useContext, useEffect } from "react";
import { Alert } from "react-native";

export const EmployeesContext = createContext();

export const EmployeesProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Load data on start
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load from AsyncStorage if needed
      // const saved = await AsyncStorage.getItem('employeesData');
      // if (saved) {
      //   const parsed = JSON.parse(saved);
      //   setEmployees(parsed.employees);
      //   setTransactions(parsed.transactions);
      // }
      
      // Sample data for testing
      const sampleEmployees = [
        {
          id: 1,
          name: "Ahmed Khan",
          fatherName: "Mohammad Khan",
          address: "Street 12, Sector G-11, Islamabad",
          cnic: "12345-6789012-3",
          salary: 50000,
          joiningDate: new Date().toISOString(),
          status: "active",
        }
      ];
      setEmployees(sampleEmployees);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const saveData = async () => {
    try {
      // Save to AsyncStorage
      // await AsyncStorage.setItem('employeesData', JSON.stringify({ employees, transactions }));
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const addEmployee = (employeeData) => {
    const newEmployee = {
      id: Date.now(),
      ...employeeData,
      joiningDate: new Date().toISOString(),
      status: "active",
      totalPaid: 0,
      lastPayment: null,
    };
    
    setEmployees(prev => [...prev, newEmployee]);
    saveData();
    Alert.alert("Success", "Employee added successfully!");
    return true;
  };

  const updateEmployee = (id, employeeData) => {
    setEmployees(prev => 
      prev.map(emp => 
        emp.id === id ? { ...emp, ...employeeData } : emp
      )
    );
    saveData();
    Alert.alert("Success", "Employee updated successfully!");
    return true;
  };

  const deleteEmployee = (id) => {
    Alert.alert(
      "Delete Employee",
      "Are you sure you want to delete this employee?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setEmployees(prev => prev.filter(emp => emp.id !== id));
            saveData();
            Alert.alert("Success", "Employee deleted successfully!");
          },
        },
      ]
    );
  };

  const releaseSalary = (employeeId, amount, month, year) => {
    const employee = employees.find(emp => emp.id === employeeId);
    
    if (!employee) {
      Alert.alert("Error", "Employee not found");
      return false;
    }

    if (amount > employee.salary) {
      Alert.alert("Error", "Amount cannot exceed salary");
      return false;
    }

    const newTransaction = {
      id: Date.now(),
      employeeId: employeeId,
      employeeName: employee.name,
      amount: amount,
      month: month,
      year: year,
      date: new Date().toISOString(),
      type: "salary_release",
      status: "completed",
    };

    setTransactions(prev => [newTransaction, ...prev]);
    
    // Update employee's total paid
    setEmployees(prev =>
      prev.map(emp =>
        emp.id === employeeId
          ? {
              ...emp,
              totalPaid: (emp.totalPaid || 0) + amount,
              lastPayment: new Date().toISOString(),
            }
          : emp
      )
    );
    
    saveData();
    Alert.alert("Success", `Salary of ${amount} released to ${employee.name}`);
    return true;
  };

  const getEmployeeTransactions = (employeeId) => {
    return transactions.filter(t => t.employeeId === employeeId);
  };

  const getTotalPaidToEmployee = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee?.totalPaid || 0;
  };

  const getPendingSalary = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) return 0;
    return employee.salary - (employee.totalPaid || 0);
  };

  return (
    <EmployeesContext.Provider
      value={{
        employees,
        setEmployees,
        transactions,
        setTransactions,
        showAddModal,
        setShowAddModal,
        editingEmployee,
        setEditingEmployee,
        selectedEmployee,
        setSelectedEmployee,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        releaseSalary,
        getEmployeeTransactions,
        getTotalPaidToEmployee,
        getPendingSalary,
      }}
    >
      {children}
    </EmployeesContext.Provider>
  );
};

export const useEmployees = () => {
  const context = useContext(EmployeesContext);
  if (!context) {
    throw new Error("useEmployees must be used within EmployeesProvider");
  }
  return context;
};