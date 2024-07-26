import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Authenticator, View, Image, useTheme } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import logo from "./assets/trainicity-logo.png";
import { AppProvider } from "./context/appContext";
import App from "./App";
import "./global.css";

import awsExports from "./aws-exports";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(awsExports);

const queryClient = new QueryClient();

const components = {
  Header() {
    const { tokens } = useTheme();
    return (
      <View textAlign="center" padding={tokens.space.large}>
        <Image
          alt="Trainicity Logo"
          src={logo} // Replace with your logo path
        />
      </View>
    );
  },
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Authenticator components={components}>
    {({ signOut, user }) => (
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <React.StrictMode>
            <BrowserRouter>
              <App user={user} signOut={signOut} />
            </BrowserRouter>
          </React.StrictMode>
        </AppProvider>
      </QueryClientProvider>
    )}
  </Authenticator>
);
