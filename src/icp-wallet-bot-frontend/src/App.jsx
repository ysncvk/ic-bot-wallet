import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import WebApp from "@twa-dev/sdk";
import AppContent from "./AppContent";
import { AuthProvider } from "./components/AuthContext";
import { WalletProvider } from "./components/WalletContext";
import { SnackbarProvider } from "./components/snackbar";
import ThemeProvider from "./components/ThemeProvider.jsx";

const App = () => {
  useEffect(() => {
    WebApp.ready();
  }, []);

  return (
    <Router>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Router>
  );
};

export default App;
