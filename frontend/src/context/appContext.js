import React, { createContext, useState, useContext } from "react";

const appContext = createContext();

export const useAppContext = () => useContext(appContext);

export const AppProvider = ({ children }) => {
  const [currentPlatformInfo, setCurrentPlatformInfo] = useState({
    domain: "",
    clientId: "",
    clientSecret: "",
  });

  const [authenticated, setAuthenticated] = useState(false);

  return (
    <appContext.Provider
      value={{
        currentPlatformInfo,
        setCurrentPlatformInfo,
        authenticated,
        setAuthenticated,
      }}
    >
      {children}
    </appContext.Provider>
  );
};
