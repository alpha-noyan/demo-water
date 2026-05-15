import { createContext, useState, useContext, useEffect } from "react";
import { Alert } from "react-native";
import {createEmployee, fetchEmployees, makeTransaction, fetchEmployeeSalaries} from "../../db/employee_db";

export const EmployeesContext = createContext();

export const EmployeesProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  async function loadEmployeesFromDB() {
    try {
      const dbEmployees = await fetchEmployees();
      console.log("Employees loaded from DB:", dbEmployees);
      setEmployees(dbEmployees);
    } catch (error) {
      console.error("Error loading employees from DB:", error);
    }
  }

  async function loadTransactionsFromDB () {
    try {
      const dbTransactions = await fetchEmployeeSalaries();
      console.log("Transactions loaded from DB:", dbTransactions);
      setTransactions(dbTransactions.salaries);
    }catch (error) {
      console.error("Error loading transactions from DB:", error);
    }
  }

  async function loadMoreTransactionsFromDB () {
    try {
      const dbTransactions = await fetchEmployeeSalaries(currentPage);
      console.log("Transactions loaded from DB:", dbTransactions);
      setTransactions(prev => [...prev, ...dbTransactions.salaries]);
    }catch (error) {
      console.error("Error loading transactions from DB:", error);
    }
  }


  // Load data on start
  useEffect(() => {
    loadData();
    loadEmployeesFromDB();
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
          date_of_joining: new Date().toISOString(),
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

  const addEmployee = async (employeeData) => {
    const newEmployee = {
      id: Date.now(),
      ...employeeData,
      date_of_joining: new Date().toISOString(),
      status: "active",
      totalPaid: 0,
      lastPayment: null,
    };
    try{
      console.log("Adding employee to DB:", newEmployee);
      await createEmployee(newEmployee.name, newEmployee.fatherName, newEmployee.address, newEmployee.cnic, newEmployee.salary, newEmployee.phone);
      setEmployees(prev => [...prev, newEmployee]);
    }catch(error){
      console.error("Error creating employee in DB:", error);
      Alert.alert("Error", "Failed to add employee. Please try again.");
      return false;
    }
    console.log("employeedata", employeeData);
    await saveData();
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

  const releaseSalary = async (employeeId, amount, month, year) => {
    const employee = employees.find(emp => emp.id === employeeId);
    
    if (!employee) {
      Alert.alert("Error", "Employee not found");
      return false;
    }

    if (amount > employee.salary) {
      Alert.alert("Error", "Amount cannot exceed salary");
      return false;
    }

    await makeTransaction(employeeId, amount)

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
        loadTransactionsFromDB,
        loadMoreTransactionsFromDB,
        totalPages,
        currentPage,
        setCurrentPage,
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