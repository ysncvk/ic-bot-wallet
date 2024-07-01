import { HttpAgent } from "@dfinity/agent";
import { LedgerCanister } from "@dfinity/ledger-icp";
import { Buffer } from "buffer";
import { useWallet } from "../components/WalletContext.jsx";

if (!window.Buffer) {
  window.Buffer = Buffer;
}

const LedgerCanisterId = "ryjl3-tyaaa-aaaaa-aaaba-cai";

export const getBalance = async (account) => {
  const agent = new HttpAgent({
    host: "https://icp-api.io",
  });

  const ledger = LedgerCanister.create({
    agent,
    canisterId: LedgerCanisterId,
  });

  // Kullanıcının account ID'sini al ve Buffer kullanarak dönüştür
  const accountIdBuffer = Buffer.from(account, "hex");

  // Bakiyeyi çek
  const balanceResult = await ledger.accountBalance({
    accountIdentifier: accountIdBuffer,
  });

  if (Number(balanceResult) === null || Number(balanceResult) === 0) {
    return 0;
  } else {
    const balanceICP = Number(balanceResult) / 100_000_000; // e8s formatından ICP'ye çevirme
    return balanceICP;
  }
};
