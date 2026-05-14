import { createContext, useContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import {fetchInfo, updateInfo, makeTransaction, fetchTransaction, reverseTransactionn} from '../../db/info_db';

export const BsnsContext = createContext();

export const BsnsProvider = ({ children }) => {
  const [info, setInfo] = useState({
    name: "Khattak Traders",
    amount: 0,
    currency: "₨",
    current_amount: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [popup, setPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [totalPage,setTotalPage] = useState(1);
  const [currentPage,setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  async function infoFromDB () {
    try{
      const data = await fetchInfo();
      console.log("Fetched info from DB:", data);
      setInfo({
        name: data.name || "Khattak Traders",
        amount: data.amount || 0,
        currency: "₨",
        current_amount: data.current_amount || 0,
      })
    }catch (error){
      console.error("Error fetching info from DB:", error);
    }
  }

  async function fetchTransactionsFromDB (page = 1) {
    try{
      const data = await fetchTransaction(page);
      console.log("Fetched transactions from DB:", data);
      setTotalPage(data.totalPages);
      setTransactions(data?.result || []);
    }catch (error){
      console.error("Error fetching transactions from DB:", error);
    }
  }

  async function fetchMoreTransactionsFromDB (page = 1) {
    try{
      setLoadingMore(true);
      const data = await fetchTransaction(page);
      console.log("Fetched transactions from DB:", data);
      setTotalPage(data.totalPages);
      setTransactions(prev => [...prev, ...(data?.result || [])]);
    }catch (error){
      console.error("Error fetching transactions from DB:", error);
    }finally {
      setLoadingMore(false);
    }
  }

  // Load data from storage on start
  useEffect(() => {
    loadData();
    infoFromDB();
    fetchTransactionsFromDB(currentPage);
  }, []);

  const loadData = async () => {
    try {
      // You can implement AsyncStorage here
      // const savedData = await AsyncStorage.getItem('businessData');
      // if (savedData) {
      //   const parsed = JSON.parse(savedData);
      //   setInfo(parsed.info);
      //   setTransactions(parsed.transactions);
      // }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const saveData = async (name) => {
    try {
     await updateInfo(name);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  async function transaction(amount, name) {
    try {
      await makeTransaction(amount, name);
      await fetchTransactionsFromDB(1);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error making transaction:", error);
    }
  }

  async function addAmount(amount, name, type = "invested") {
    if (!amount || amount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount");
      return false;
    }
    
    if (!name || name.trim() === "") {
      Alert.alert("Invalid Name", "Please enter a name");
      return false;
    }

    setInfo((it) => {
      const newAmount = it.amount + amount;
      const newCurrentAmount = it.current_amount + amount;
      return { ...it, amount: newAmount, current_amount: newCurrentAmount };
    });

    const newTransaction = {
      id: Date.now(),
      name: name.trim(),
      amount: amount,
      status: type,
      date: new Date().toISOString(),
      type: "credit",
    };

    setTransactions((it) => [newTransaction, ...it]);
    await transaction(amount, name.trim());
    Alert.alert("Success", `${amount} added successfully!`);
    return true;
  }

  function withdrawAmount(amount, name, reason = "withdrawal") {
    if (!amount || amount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount");
      return false;
    }
    
    if (amount > info.amount) {
      Alert.alert("Insufficient Balance", `You only have ${info.currency}${info.amount}`);
      return false;
    }

    setInfo((it) => {
      const newAmount = it.amount - amount;
      return { ...it, amount: newAmount };
    });

    const newTransaction = {
      id: Date.now(),
      name: name.trim(),
      amount: amount,
      status: "withdrawn",
      reason: reason,
      date: new Date().toISOString(),
      type: "debit",
    };

    setTransactions((it) => [newTransaction, ...it]);
    saveData();
    Alert.alert("Success", `${amount} withdrawn successfully!`);
    return true;
  }

  function changeName(name) {
    if (!name || name.trim() === "") {
      Alert.alert("Invalid Name", "Please enter a valid business name");
      return false;
    }
    setInfo((it) => {
      return { ...it, name: name.trim() };
    });
    saveData(name.trim());
    Alert.alert("Success", "Business name updated!");
    return true;
  }

  function reverseTransaction(id) {
    Alert.alert(
      "Reverse Transaction",
      "Are you sure you want to reverse this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reverse",
          style: "destructive",
          onPress: async () => {
            console.log("Reversing transaction with ID:", id);
            await reverseTransactionn(id);
            setTransactions((prev) => prev.map((item) => {
              if (item.id === id) {
                return { ...item, status: 'reversed' };
              }
              return item;
            }));
            await infoFromDB();
            Alert.alert("Success", "Transaction reversed!");
          },
        },
      ]
    );
  }

  function deleteTransaction(id) {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setTransactions((prev) => prev.filter((item) => item.id !== id));
            saveData();
            Alert.alert("Success", "Transaction deleted!");
          },
        },
      ]
    );
  }

  function getTotalInvested() {
    return info.amount;
  }

  function getTotalWithdrawn() {
    return info.current_amount;
  }

  return (
    <BsnsContext.Provider
      value={{
        info,
        setInfo,
        popup,
        setPopup,
        transactions,
        addAmount,
        withdrawAmount,
        changeName,
        reverseTransaction,
        deleteTransaction,
        isEditing,
        setIsEditing,
        getTotalInvested,
        getTotalWithdrawn,
        totalPage,
        currentPage,
        setCurrentPage,
        fetchMoreTransactionsFromDB,
        loadingMore,
      }}
    >
      {children}
    </BsnsContext.Provider>
  );
};

export const useBsns = () => {
  const context = useContext(BsnsContext);
  if (!context) {
    throw new Error("useBsns must be used within a BsnsProvider");
  }
  return context;
};