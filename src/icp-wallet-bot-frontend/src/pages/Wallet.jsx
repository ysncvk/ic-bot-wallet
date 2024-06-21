import React, { useState } from "react";
import { Container, Typography, Box, Stack, IconButton } from "@mui/material";
import { useWallet } from "../components/WalletContext.jsx";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import WebApp from "@twa-dev/sdk";

const Wallet = () => {
  const { wallet } = useWallet();
  console.log("wallet cüzdan:", wallet);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
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

  return (
    <Container>
      <Stack alignItems="center" paddingTop={5}>
        <Icon icon="mdi:wallet" width={50} height={50} color="#05A8DD" />
        <Typography variant="h6" color="#05A8DD">
          Wallet Info
        </Typography>
      </Stack>

      <Stack direction="column" gap={1}>
        <Typography variant="body2" marginTop={3}>
          Principal ID
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
            variant="caption"
            sx={{
              flexGrow: 1,
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {wallet[0].principalId.toText()}
          </Typography>
        </Box>
      </Stack>
      <Stack direction="column" gap={1}>
        <Typography variant="body2" marginTop={3}>
          Account ID
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
            variant="caption"
            sx={{
              flexGrow: 1,
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {wallet[0].accountId}
          </Typography>
        </Box>
      </Stack>

      <Stack direction="column" gap={1}>
        <Typography variant="body2" marginTop={3}>
          Private Key
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
            variant="caption"
            sx={{
              flexGrow: 1,
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {showPrivateKey
              ? wallet[0].privateKey
              : "**************************"}
          </Typography>
          <IconButton onClick={() => setShowPrivateKey(!showPrivateKey)}>
            {showPrivateKey ? (
              <Icon icon="solar:eye-bold" />
            ) : (
              <Icon icon="solar:eye-closed-bold" />
            )}
          </IconButton>
        </Box>
      </Stack>
    </Container>
  );
};

export default Wallet;
