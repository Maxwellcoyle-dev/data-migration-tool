import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Authentication from "./pages/Authentication";

// Components
import Callback from "./components/Callback";
import NavBar from "./components/NavBar";

// Hooks
import useGetPlatforms from "./hooks/useGetPlatforms";

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
