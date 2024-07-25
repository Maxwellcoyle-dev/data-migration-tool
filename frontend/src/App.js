import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Authentication from "./pages/Authentication";
import LogsPage from "./pages/LogsPage/LogsPage.jsx";
import Log from "./pages/Log/Log";

// Components
import Callback from "./components/Callback";
import NavBar from "./components/NavBar/NavBar";

// Hooks
import useGetPlatforms from "./hooks/useGetPlatforms";
import useListImportLogs from "./hooks/useListImportLogs.js";

// context
import { ResponseLogProvider } from "./context/responseLogContext";

const App = ({ user }) => {
  const [currentPlatformInfo, setCurrentPlatformInfo] = useState({
    domain: "",
    clientId: "",
    clientSecret: "",
  });

  const [authenticated, setAuthenticated] = useState(false);

  const { platforms } = useGetPlatforms({ userId: user.userId });

  const { logsList } = useListImportLogs();
  useEffect(() => {
    console.log("logsList", logsList);
  }, [logsList]);

  useEffect(() => {
    if (platforms?.length) {
      const platform = platforms[0];
      setCurrentPlatformInfo({
        domain: platform.platformUrl,
        clientId: platform.clientId,
        clientSecret: platform.clientSecret,
      });

      // if the platform.timeStamp is less than 60 minutes old, set authenticated to true
      const timeStamp = new Date(platform.timeStamp).getTime();
      const currentTime = new Date().getTime();
      const difference = currentTime - timeStamp;
      const minutes = difference / 1000 / 60;
      if (minutes < 60) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    }
  }, [platforms]);

  return (
    <ResponseLogProvider>
      <div>
        <NavBar
          domain={currentPlatformInfo.domain}
          authenticated={authenticated}
        />
        <Routes>
          <Route
            index
            path="/"
            element={
              <Home currentPlatformInfo={currentPlatformInfo} user={user} />
            }
          />
          <Route path="/logs" element={<LogsPage logsList={logsList} />} />
          <Route path="/log/:id" element={<Log />} />
          <Route
            path="/authentication"
            element={
              <Authentication
                user={user}
                setCurrentPlatformInfo={setCurrentPlatformInfo}
                authenticated={authenticated}
                setAuthenticated={setAuthenticated}
              />
            }
          />
          <Route path="/callback" element={<Callback />} />
        </Routes>
      </div>
    </ResponseLogProvider>
  );
};

export default App;
