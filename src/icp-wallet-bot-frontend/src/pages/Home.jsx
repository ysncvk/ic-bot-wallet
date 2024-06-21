import React, { useEffect } from "react";
import {
  Button,
  Container,
  Typography,
  Stack,
  Box,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../components/WalletContext.jsx";
import WebApp from "@twa-dev/sdk";
import { Icon } from "@iconify/react";
import RotatingImage from "../components/RotateImage.jsx";
import LoadingScreen from "../components/LoadingScreen.jsx";

const Home = () => {
  const { wallet, loading, balance } = useWallet();
  const navigate = useNavigate();
  console.log("wallet:", wallet);

  useEffect(() => {
    WebApp.BackButton.hide();
  }, []);

  if (loading || !wallet || balance === null) {
    return <LoadingScreen />;
  }

  return (
    <Container>
      <Box>
        <IconButton onClick={() => navigate("/wallet")}>
          <Icon icon="mdi:wallet" width={40} height={40} />
        </IconButton>
      </Box>
      <RotatingImage />
      <Typography variant="body1" paddingBottom={1}>
        Your Balance:{" "}
      </Typography>
      <Box
        padding={1}
        width={1}
        borderRadius={3}
        border="solid"
        textAlign="center"
      >
        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="h3">{balance.toFixed(2)}</Typography>
          <Typography variant="body2">ICP</Typography>
        </Stack>
      </Box>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        marginTop={3}
      >
        <Button
          variant="contained"
          fullWidth
          startIcon={<Icon icon="bitcoin-icons:send-filled" />}
          onClick={() => navigate("/send")}
        >
          Transfer
        </Button>
        <Button
          variant="contained"
          fullWidth
          startIcon={<Icon icon="bitcoin-icons:receive-filled" />}
          onClick={() => navigate("/receive")}
        >
          Receive
        </Button>
      </Stack>
    </Container>
  );
};

export default Home;
