import React, { createContext, useContext, useState } from "react";

interface GlobalContextType {
  mobile_email: string;
  setMobile_email: React.Dispatch<React.SetStateAction<string>>;
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  notices: any;
  setNotices: React.Dispatch<React.SetStateAction<any>>;
  popupNames: string;
  setPopupNames: React.Dispatch<React.SetStateAction<string>>;
  teacher: any;
  setTeacher: React.Dispatch<React.SetStateAction<any>>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mobile_email, setMobile_email] = useState("");
  const [user, setUser] = useState({});
  const [notices, setNotices] = useState([]);
  const [teacher, setTeacher] = useState({});
  const [popupNames, setPopupNames] = useState("");

  const values: GlobalContextType = {
    mobile_email,
    setMobile_email,
    user,
    setUser,
    notices,
    setNotices,
    popupNames,
    setPopupNames,
    teacher,
    setTeacher,
  };
  return (
    <GlobalContext.Provider value={values}>{children}</GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const ctx = useContext(GlobalContext);
  if (!ctx)
    throw new Error("useStateContext must be used within a StateProvider");
  return ctx;
};
