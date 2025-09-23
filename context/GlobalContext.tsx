import React, { createContext, useContext, useState } from "react";

interface GlobalContextType {
  mobile: string;
  setMobile: React.Dispatch<React.SetStateAction<string>>;
  name: any;
  setName: React.Dispatch<React.SetStateAction<any>>;
  adress: any;
  setAdress: React.Dispatch<React.SetStateAction<any>>;
  popupNames: string;
  setPopupNames: React.Dispatch<React.SetStateAction<string>>;
  teacher: any;
  setTeacher: React.Dispatch<React.SetStateAction<any>>;
  foodStyle : string
  setFoodStyle : React.Dispatch<React.SetStateAction<string>>
  activeStep : number
  setActiveStep : React.Dispatch<React.SetStateAction<number>>
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [adress, setAdress] = useState("");
  const [teacher, setTeacher] = useState("");
  const [popupNames, setPopupNames] = useState("");
  const [foodStyle, setFoodStyle] = useState("south");
  const [activeStep, setActiveStep] = useState(1);

  const values: GlobalContextType = {
    mobile,
    setMobile,
    name,
    setName,
    adress,
    setAdress,
    popupNames,
    setPopupNames,
    teacher,
    setTeacher,
    foodStyle,
    setFoodStyle,
    activeStep,
    setActiveStep
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
