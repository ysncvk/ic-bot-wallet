import React, { useState } from "react";
import { Container, Typography, Stack } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import { useWallet } from "../components/WalletContext.jsx";
import SvgColor from "../components/svg-color";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import WebApp from "@twa-dev/sdk";
import { IndexCanister } from "@dfinity/ledger-icp";
import { Buffer } from "buffer";
import { HttpAgent } from "@dfinity/agent";
import LoadingScreen from "../components/LoadingScreen.jsx";
import HistoryTableRow from "../components/HistoryItem.jsx";

if (!window.Buffer) {
  window.Buffer = Buffer;
}

const LedgerCanisterId = "qhbym-qaaaa-aaaaa-aaafq-cai";
const History = () => {
  const navigate = useNavigate();
  const { wallet } = useWallet();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const account = wallet[0].accountId;

  useEffect(() => {
    WebApp.BackButton.show();

    // Handle Telegram back button
    const handleBackButton = () => {
      navigate(-1);
    };

    WebApp.BackButton.onClick(handleBackButton);

    // Clean up the event listener
    return () => {
      WebApp.BackButton.offClick(handleBackButton);
    };
  }, [navigate]);

  useEffect(() => {
    getTransactions();
  }, [navigate]);

  const getTransactions = async () => {
    setLoading(true);
    const agent = new HttpAgent({
      host: "https://icp-api.io",
    });

    const ledger = IndexCanister.create({
      agent,
      canisterId: LedgerCanisterId,
    });
    const result = await ledger.getTransactions({
      certified: false,
      accountIdentifier: account,
      maxResults: BigInt(10),
    });

    setData(result.transactions);
    setLoading(false);
  };

  return (
    <Container>
      <Stack alignItems="center" paddingTop={5} paddingBottom={5}>
        <SvgColor
          src="/icons/history.svg"
          width={50}
          height={50}
          color="#05A8DD"
        />
        <Typography variant="h6" color="#05A8DD">
          Transaction History
        </Typography>
      </Stack>
      <Stack direction="column" gap={1}>
        {loading ? (
          <LoadingScreen />
        ) : (
          data?.map((row) => <HistoryTableRow key={row?.id} row={row} />)
        )}
      </Stack>

      {data.length === 0 && !loading && (
        <Typography variant="body2">No transactions found....</Typography>
      )}
    </Container>
  );
};

export default History;
