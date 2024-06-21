import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Stack,
  IconButton,
  InputAdornment,
} from "@mui/material";
import WebApp from "@twa-dev/sdk";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

const Send = () => {
  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState("");

  const navigate = useNavigate();

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
        <Button variant="contained" fullWidth>
          Transfer ICP
        </Button>
      </Box>
    </Container>
  );
};

export default Send;
