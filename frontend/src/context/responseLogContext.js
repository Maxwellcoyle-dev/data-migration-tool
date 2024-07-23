import React, { createContext, useState, useContext } from "react";

const responseLogContext = createContext();

export const useResponseLogContext = () => useContext(responseLogContext);

export const ResponseLogProvider = ({ children }) => {
  const [responseLogs, setResponseLogs] = useState({
    success: [],
    errors: [],
    showLogs: false,
  });

  return (
    <responseLogContext.Provider
      value={{
        responseLogs,
        setResponseLogs,
      }}
    >
      {children}
    </responseLogContext.Provider>
  );
};
