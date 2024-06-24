import React, { createContext, useState, useContext, useEffect } from "react";
import { icp_wallet_bot_backend } from "declarations/icp-wallet-bot-backend";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isUser, setIsUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [telegramId, setTelegramId] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    window.Telegram.WebApp.ready();
    const telegramUser = window.Telegram.WebApp.initDataUnsafe.user;
    setTelegramId(telegramUser.id);
    setUserName(telegramUser.first_name);
  }, [isUser]);

  useEffect(() => {
    if (telegramId !== null) {
      checkUser(telegramId);
      console.log(telegramId);
    }
  }, [telegramId, isUser]);

  const checkUser = async () => {
    try {
      const result = await icp_wallet_bot_backend.checkUser(telegramId);
      setIsUser(result);
      console.log("result:", result);
    } catch (error) {
      console.error("Error checking user:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isUser, loading, telegramId, userName, setIsUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
