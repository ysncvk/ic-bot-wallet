import React from "react";
import { Container, Typography, Box, Stack } from "@mui/material";
import { useWallet } from "../components/WalletContext.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import SvgColor from "../components/svg-color";
import WebApp from "@twa-dev/sdk";

const Wallet = () => {
  const { wallet } = useWallet();

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
        <SvgColor
          src="/icons/wallet.svg"
          width={50}
          height={50}
          color="#05A8DD"
        />
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
    </Container>
  );
};

export default Wallet;
