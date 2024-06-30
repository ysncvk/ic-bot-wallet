import React, { useEffect } from "react";
import { Container, Typography, IconButton, Box, Alert } from "@mui/material";
import QRCode from "qrcode.react";
import { useNavigate } from "react-router-dom";
import WebApp from "@twa-dev/sdk";
import { useWallet } from "../components/WalletContext.jsx";
import { useSnackbar } from "../components/snackbar";
import SvgColor from "../components/svg-color";

const Receive = () => {
  const { wallet } = useWallet();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const copyToClipboard = async () => {
    try {
      window.Telegram.WebApp.HapticFeedback.impactOccurred("medium");
      await navigator.clipboard.writeText(wallet[0].accountId);
      enqueueSnackbar("Copied to clipboard", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Failed to copy", { variant: "error" });
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

  return (
    <Container>
      <Alert severity="info">
        You can copy and share your wallet address by clicking on the address.
        You can also share your wallet QRCode.
      </Alert>
      <Box width={1} textAlign="center" paddingTop={2}>
        <Box
          border="solid"
          padding={1}
          textAlign="center"
          display="inline-block"
        >
          <QRCode
            value={wallet[0].accountId}
            level="M"
            size={200}
            fgColor="#05A8DD"
          />
        </Box>
      </Box>
      <Typography variant="body1" marginTop={3}>
        Account:{" "}
      </Typography>
      <Box
        display="flex"
        alignItems="center"
        borderRadius={3}
        border="solid"
        borderColor="aliceblue"
        padding={1}
      >
        <Typography
          variant="body1"
          sx={{
            flexGrow: 1,
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
        >
          {wallet[0].accountId}
        </Typography>
        <IconButton onClick={copyToClipboard}>
          <SvgColor src="/icons/copy.svg" color="#05A8DD" />
        </IconButton>
      </Box>
    </Container>
  );
};

export default Receive;
