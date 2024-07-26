import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import { AppProvider } from "./context/appContext";

import App from "./App";
import "./global.css";

// Amplify configuration
import awsExports from "./aws-exports";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(awsExports);

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Authenticator>
    {({ signOut, user }) => (
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <React.StrictMode>
            <BrowserRouter>
              <App user={user} />
            </BrowserRouter>
          </React.StrictMode>
        </AppProvider>
      </QueryClientProvider>
    )}
  </Authenticator>
);
