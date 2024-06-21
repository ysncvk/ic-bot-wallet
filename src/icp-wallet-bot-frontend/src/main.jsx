import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.scss";
import "@telegram-apps/telegram-ui/dist/styles.css";
import { AppRoot } from "@telegram-apps/telegram-ui";
import ThemeProvider from "./components/ThemeProvider.jsx";
import { SnackbarProvider } from "./components/snackbar";
import { AuthProvider } from "./components/AuthContext";
import { WalletProvider } from "./components/WalletContext";
import WebApp from "@twa-dev/sdk";

WebApp.ready();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppRoot>
      <AuthProvider>
        <WalletProvider>
          <SnackbarProvider>
            <ThemeProvider>
              <App />
            </ThemeProvider>
          </SnackbarProvider>
        </WalletProvider>
      </AuthProvider>
    </AppRoot>
  </React.StrictMode>
);
