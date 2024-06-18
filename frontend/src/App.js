import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Authentication from "./pages/Authentication";
import Callback from "./components/Callback";
import NavBar from "./components/NavBar";

import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";

import awsExports from "./aws-exports";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(awsExports);

const App = () => {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("docebo_access_token")
  );
  const [platformAuth, setPlatformAuth] = useState({
    accessToken: "",
    lastUpdated: "",
    // check if lastUpdated is less then 3600 seconds ago (1 hour) if so, then the token is still valid
    authenticated: false,
  });
  const [currentPlatformInfo, setCurrentPlatformInfo] = useState({
    domain: "",
    clientId: "",
    clientSecret: "",
  });

  useEffect(() => {
    const platformDetails = JSON.parse(
      localStorage.getItem("platform_details")
    );

    if (platformDetails) {
      const { domain, clientId, clientSecret } = platformDetails;
      if (domain && clientId && clientSecret) {
        setCurrentPlatformInfo({ domain, clientId, clientSecret });
      }
    }

    const platformAuth = JSON.parse(
      localStorage.getItem("docebo_platform_auth")
    );

    if (platformAuth) {
      const { accessToken, lastUpdated } = platformAuth;
      if (accessToken && lastUpdated) {
        setPlatformAuth({
          accessToken,
          lastUpdated,
          authenticated:
            accessToken && Date.now() - platformAuth.lastUpdated < 3600000,
        });
      }
    }
  }, []);

  useEffect(() => {
    console.log("App.js: currentPlatformInfo", currentPlatformInfo);
    console.log("App.js: platformAuth", platformAuth);
  }, [currentPlatformInfo, platformAuth]);

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div>
          <NavBar
            domain={currentPlatformInfo.domain}
            authenticated={platformAuth.authenticated}
          />
          <Routes>
            <Route
              index
              path="/"
              element={
                <Home
                  accessToken={accessToken}
                  setAccessToken={setAccessToken}
                  domain={currentPlatformInfo.domain}
                />
              }
            />
            <Route
              path="/authentication"
              element={
                <Authentication
                  platformAuth={platformAuth}
                  setCurrentPlatformInfo={setCurrentPlatformInfo}
                />
              }
            />
            <Route
              path="/callback"
              element={<Callback setAccessToken={setAccessToken} />}
            />
          </Routes>
        </div>
      )}
    </Authenticator>
  );
};

export default App;
