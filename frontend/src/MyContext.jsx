import React, { createContext, useState, useEffect } from "react";

export const MyContext = createContext();

export const ContextProvider = ({ children }) => {
  const [me, setMe] = useState(null);

  return (
    <MyContext.Provider value={{ me, setMe }}>{children}</MyContext.Provider>
  );
};
