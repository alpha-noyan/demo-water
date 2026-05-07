import { createContext, useContext, useState } from "react";

export const BsnsContext = createContext();

export const BsnsProvider = ({ children }) => {
  const [info, setInfo] = useState({
    name: "Khattak Traders",
    amount: 20,
  });
  const [transactions, setTransactions] = useState([]);
  const [popup, setPopup] = useState(false);
  function addAmount(amount, name) {
    setInfo((it) => {
      return { ...it, amount: amount };
    });

    setTransactions((it) => {
      return [...it, { name, amount, status: "invested" }];
    });
  }
  function changeName(name) {
    setInfo((it) => {
      return { ...it, name: name };
    });
  }
  function reverseTransaction(idx) {
    setTransactions((prev) =>
      prev.map((item, i) =>
        i === idx ? { ...item, status: "reversed" } : item,
      ),
    );
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
        changeName,
        reverseTransaction,
      }}
    >
      {children}
    </BsnsContext.Provider>
  );
};

export const useBsns = () => {
  return useContext(BsnsContext);
};
