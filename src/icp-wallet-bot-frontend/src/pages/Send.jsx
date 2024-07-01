import React, { useEffect, useState } from "react";
import {
  Button,
  Box,
  Container,
  TextField,
  Typography,
  Stack,
  IconButton,
  InputAdornment,
} from "@mui/material";
import WebApp from "@twa-dev/sdk";
import { useNavigate } from "react-router-dom";
import { decrypt } from "../utils/cryptoUtils";
import { useWallet } from "../components/WalletContext.jsx";
import { HttpAgent } from "@dfinity/agent";
import { AccountIdentifier, LedgerCanister } from "@dfinity/ledger-icp";
import LoadingButton from "@mui/lab/LoadingButton";
import { useSnackbar } from "../components/snackbar";
import { Ed25519KeyIdentity } from "@dfinity/identity/lib/cjs/identity/ed25519";
import { Buffer } from "buffer";
import SvgColor from "../components/svg-color";
import { useAuth } from "../components/AuthContext.jsx";
import { getBalance } from "../utils/getBalance.js";

if (!window.Buffer) {
  window.Buffer = Buffer;
}

const Send = () => {
  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ accountId: "", amount: "" });
  const [isSent, setIsSent] = useState(false);
  const [block, setBlock] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const { wallet, balance, setBalance } = useWallet();
  const { telegramId } = useAuth();
  const navigate = useNavigate();
  const LedgerCanisterId = "ryjl3-tyaaa-aaaaa-aaaba-cai";

  const validate = () => {
    let isValid = true;
    const errors = {};

    if (!accountId) {
      errors.accountId = "Account ID is required.";
      isValid = false;
    } else if (!/^[a-f0-9]{64}$/.test(accountId)) {
      errors.accountId = "Invalid Account ID format.";
      isValid = false;
    }

    if (!amount) {
      errors.amount = "Amount is required.";
      isValid = false;
    } else if (isNaN(amount) || amount <= 0) {
      errors.amount = "Invalid amount.";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleMaxClick = () => {
    if (balance - 0.0001 <= 0) {
      setAmount(0);
      enqueueSnackbar("Insufficient Balance...", {
        variant: "error",
      });
    } else {
      setAmount((balance - 0.0001).toFixed(7));
    } // Adjust the precision if necessary
  };

  const handleNewTransfer = () => {
    setAmount("");
    setAccountId("");
    setIsSent(false);
  };

  const handleTransfer = async () => {
    if (!validate()) {
      return;
    }
    if (!wallet || !wallet[0].accountId) {
      console.error("User account ID is missing");
      return;
    }

    if (balance - 0.0001 < amount) {
      enqueueSnackbar("Insufficient Balance...", {
        variant: "error",
      });
      return;
    }

    setLoading(true);
    try {
      // Create an HttpAgent with the user's identity
      const encryptedPrivateKey = wallet[0].privateKey;
      const salt = wallet[0].salt;
      const privateKeyBase64 = decrypt(
        encryptedPrivateKey,
        telegramId.toString(),
        salt
      ); // Şifre çözme işlemi

      const privateKeyUint8Array = Uint8Array.from(
        atob(privateKeyBase64),
        (c) => c.charCodeAt(0)
      );
      const identity = Ed25519KeyIdentity.fromSecretKey(privateKeyUint8Array);

      const agent = new HttpAgent({
        host: "https://icp-api.io",
        identity: identity,
      });

      const ledger = LedgerCanister.create({
        agent,
        canisterId: LedgerCanisterId,
      });

      const transferAmountE8s = BigInt(Math.round(amount * 100_000_000)); // Convert ICP to e8s format

      const recipientAccountIdBuffer = AccountIdentifier.fromHex(accountId);

      const result = await ledger.transfer({
        to: recipientAccountIdBuffer,
        amount: transferAmountE8s,
      });

      if (result !== undefined) {
        enqueueSnackbar("Transfer successful...", { variant: "success" });
        setLoading(false);
        setBlock(Number(result).toString());
        setIsSent(true);
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

    console.log(navigate);
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
        <SvgColor
          src="/icons/send.svg"
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
        error={!!errors.accountId}
        helperText={errors.accountId}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleScanQRCode}>
                <SvgColor src="/icons/scan.svg" color="#05A8DD" />
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
        error={!!errors.amount}
        helperText={errors.amount}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleMaxClick}>
                <Typography variant="body2" color="orange">
                  Max
                </Typography>
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {isSent ? (
        <Box
          marginTop={3}
          borderRadius={2}
          border="solid"
          borderColor="aliceblue"
          padding={1}
        >
          <Typography variant="body1" color="success">
            Transfer completed succesfully...
          </Typography>
          <Stack direction="column" spacing={2} marginTop={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNewTransfer}
              fullWidth
              style={{ textTransform: "none" }}
            >
              Make new Transfer
            </Button>
            <Button
              variant="contained"
              color="success"
              href={`https://dashboard.internetcomputer.org/transaction/${block}`}
              target="_blank"
              fullWidth
              style={{ textTransform: "none" }}
            >
              View on ICP Dashboard
            </Button>
          </Stack>
        </Box>
      ) : (
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
      )}
    </Container>
  );
};

export default Send;
