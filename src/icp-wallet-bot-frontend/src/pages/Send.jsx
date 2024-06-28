import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Stack,
  IconButton,
  InputAdornment,
} from "@mui/material";
import WebApp from "@twa-dev/sdk";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useWallet } from "../components/WalletContext.jsx";
import { HttpAgent } from "@dfinity/agent";
import { AccountIdentifier, LedgerCanister } from "@dfinity/ledger-icp";
import LoadingButton from "@mui/lab/LoadingButton";
import { useSnackbar } from "../components/snackbar";
import { Ed25519KeyIdentity } from "@dfinity/identity/lib/cjs/identity/ed25519";
import { Buffer } from "buffer";

if (!window.Buffer) {
  window.Buffer = Buffer;
}

const Send = () => {
  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { wallet, balance } = useWallet();
  const navigate = useNavigate();
  const LedgerCanisterId = "ryjl3-tyaaa-aaaaa-aaaba-cai";

  const handleTransfer = async () => {
    if (!wallet || !wallet[0].accountId) {
      console.error("User account ID is missing");
      return;
    }
    const transferAmountE8s2 = BigInt(Math.round(amount * 100_000_000)); // Convert ICP to e8s format
    if (balance <= transferAmountE8s2) {
      enqueueSnackbar("Insufficent balance...", {
        variant: "error",
      });
      return;
    }
    setLoading(true);
    try {
      // Create an HttpAgent with the user's identity
      const privateKey = wallet[0].privateKey;
      const privateKeyUint8Array = Uint8Array.from(atob(privateKey), (c) =>
        c.charCodeAt(0)
      );
      const identity = Ed25519KeyIdentity.fromSecretKey(privateKeyUint8Array);

      const agent = new HttpAgent({
        host: "https://ic0.app",
        identity: identity,
      });

      const ledger = LedgerCanister.create({
        agent,
        canisterId: LedgerCanisterId,
      });

      const transferAmountE8s = BigInt(Math.round(amount * 100_000_000)); // Convert ICP to e8s format

      const recipientAccountIdBuffer = AccountIdentifier.fromHex(accountId);

      console.log("transferAmountE8s", transferAmountE8s);
      console.log("BigInt(10000)", BigInt(100000));
      const result = await ledger.transfer({
        to: recipientAccountIdBuffer,
        amount: transferAmountE8s,
        fee: BigInt(100000),
        memo: BigInt(0),
      });

      console.log("Transfer result:", result);
      // Update balance if transfer is successful
      if (result.Ok !== undefined) {
        enqueueSnackbar("Transfer successful...", { variant: "success" });
        setLoading(false);
      } else {
        enqueueSnackbar("There has been a problem please try again later...", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error transferring ICP:", error);
    }
  };

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

  const handleScanQRCode = () => {
    if (WebApp.isVersionAtLeast("6.4")) {
      WebApp.HapticFeedback.notificationOccurred("warning");

      WebApp.showScanQrPopup({
        text: "Scan QR Code",
      });

      const onQRTextReceivedHandler = (data) => {
        setAccountId(data.data.toString().split("/")[0]);
        WebApp.offEvent("qrTextReceived", onQRTextReceivedHandler);
        WebApp.closeScanQrPopup();
      };

      WebApp.onEvent("qrTextReceived", onQRTextReceivedHandler);
    } else {
      alert(
        "QR code scanning is not supported in this version of Telegram Web App."
      );
    }
  };

  return (
    <Container>
      <Stack alignItems="center">
        <Icon
          icon="bitcoin-icons:send-filled"
          width={50}
          height={50}
          color="#05A8DD"
        />
        <Typography variant="h6" color="#05A8DD">
          Transfer
        </Typography>
      </Stack>

      <TextField
        label="Account ID"
        value={accountId}
        onChange={(e) => setAccountId(e.target.value)}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleScanQRCode}>
                <Icon
                  icon="mdi:qrcode-scan"
                  width={24}
                  height={24}
                  color="#05A8DD"
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <TextField
        label="Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
      <Box paddingTop={3}>
        <LoadingButton
          variant="contained"
          onClick={handleTransfer}
          fullWidth
          loading={loading}
        >
          Transfer ICP
        </LoadingButton>
      </Box>
    </Container>
  );
};

export default Send;
