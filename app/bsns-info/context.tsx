import { createContext, useContext, useState, useEffect } from "react";
import { Alert } from "react-native";

export const BsnsContext = createContext();

export const BsnsProvider = ({ children }) => {
  const [info, setInfo] = useState({
    name: "Khattak Traders",
    amount: 0,
    currency: "₨",
  });
  const [transactions, setTransactions] = useState([]);
  const [popup, setPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Load data from storage on start
  useEffect(() => {
    loadData();
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

  const saveData = async () => {
    try {
      // Save to AsyncStorage
      // await AsyncStorage.setItem('businessData', JSON.stringify({ info, transactions }));
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  function addAmount(amount, name, type = "invested") {
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
      return { ...it, amount: newAmount };
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
    saveData();
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
    saveData();
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
          onPress: () => {
            const transaction = transactions.find(t => t.id === id);
            if (transaction) {
              if (transaction.type === "credit") {
                // Remove added amount
                setInfo((it) => ({
                  ...it,
                  amount: it.amount - transaction.amount
                }));
              } else {
                // Add back withdrawn amount
                setInfo((it) => ({
                  ...it,
                  amount: it.amount + transaction.amount
                }));
              }
              
              setTransactions((prev) =>
                prev.map((item) =>
                  item.id === id ? { ...item, status: "reversed", reversedAt: new Date().toISOString() } : item
                )
              );
              saveData();
              Alert.alert("Success", "Transaction reversed successfully!");
            }
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
    return transactions
      .filter(t => t.type === "credit" && t.status !== "reversed")
      .reduce((sum, t) => sum + t.amount, 0);
  }

  function getTotalWithdrawn() {
    return transactions
      .filter(t => t.type === "debit" && t.status !== "reversed")
      .reduce((sum, t) => sum + t.amount, 0);
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