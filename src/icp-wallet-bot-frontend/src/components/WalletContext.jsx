import React, { createContext, useState, useContext, useEffect } from "react";
import { icp_wallet_bot_backend } from "declarations/icp-wallet-bot-backend";
import { HttpAgent } from "@dfinity/agent";
import { LedgerCanister } from "@dfinity/ledger-icp";
import { Buffer } from "buffer";
import { useAuth } from "./AuthContext";

const WalletContext = createContext();

if (!window.Buffer) {
  window.Buffer = Buffer;
}

const LedgerCanisterId = "ryjl3-tyaaa-aaaaa-aaaba-cai";

export const WalletProvider = ({ children }) => {
  const { isUser, telegramId } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWallet(); // fetchWallet fonksiyonunu çağırın
  }, [isUser, telegramId]);

  const fetchWallet = async () => {
    try {
      setLoading(true);
      if (isUser) {
        const userData = await icp_wallet_bot_backend.getUser(telegramId);
        if (userData) {
          setWallet(userData);

          // Ledger canister ile bakiyeyi çek
          const agent = new HttpAgent({
            host: "https://icp-api.io",
          });

          const ledger = LedgerCanister.create({
            agent,
            canisterId: LedgerCanisterId,
          });

          // Kullanıcının account ID'sini al ve Buffer kullanarak dönüştür
          const accountIdBuffer = Buffer.from(userData[0].accountId, "hex");

          // Bakiyeyi çek
          const balanceResult = await ledger.accountBalance({
            accountIdentifier: accountIdBuffer,
          });

          if (Number(balanceResult) === null || Number(balanceResult) === 0) {
            setBalance(0);
          } else {
            const balanceICP = Number(balanceResult) / 100_000_000; // e8s formatından ICP'ye çevirme
            setBalance(balanceICP);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching user data and balance:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <WalletContext.Provider
      value={{ wallet, setWallet, balance, loading, fetchWallet, setBalance }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
