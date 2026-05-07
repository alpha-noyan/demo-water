import { createContext, useContext, useState } from "react";

const BsnsContext = createContext();

export const BsnsProvider = ({ children }) => {
  const [info, setInfo] = useState({
    name: "Khattak Traders",
    amount: 20,
  });
  const [popup, setPopup] = useState(false);
  return (
    <BsnsContext.Provider value={{ info, setInfo, popup, setPopup }}>
      {children}
    </BsnsContext.Provider>
  );
};

export const useBsns = () => {
  return useContext(BsnsContext);
};
