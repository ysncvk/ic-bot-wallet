import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Container } from "@mui/material";
import Home from "./pages/Home";
import CreateWallet from "./pages/CreateWallet";
import Send from "./pages/Send";
import Receive from "./pages/Receive";
import Wallet from "./pages/Wallet";
import { useAuth } from "./components/AuthContext";
import { useWallet } from "./components/WalletContext";
import LoadingScreen from "./components/LoadingScreen";

const AppContent = () => {
  const { isUser, loading: authLoading } = useAuth();
  const { loading: walletLoading } = useWallet();
  const location = useLocation();
  const [isPageLoading, setIsPageLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setIsPageLoading(true);
    const handleComplete = () => setIsPageLoading(false);

    handleStart();
    handleComplete();

    return () => {
      handleComplete();
    };
  }, [location]);

  if (authLoading || walletLoading || isPageLoading) {
    return <LoadingScreen />;
  }

  return (
    <Container>
      <Routes>
        <Route
          path="/"
          element={isUser ? <Home /> : <Navigate to="/create-wallet" />}
        />
        <Route path="/create-wallet" element={<CreateWallet />} />
        <Route path="/send" element={<Send />} />
        <Route path="/receive" element={<Receive />} />
        <Route path="/wallet" element={<Wallet />} />
      </Routes>
    </Container>
  );
};

export default AppContent;
