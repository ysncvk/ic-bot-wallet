import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Typography,
  Stack,
  Box,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../components/WalletContext.jsx";
import WebApp from "@twa-dev/sdk";
import RotatingImage from "../components/RotateImage.jsx";
import LoadingScreen from "../components/LoadingScreen.jsx";
import SvgColor from "../components/svg-color";
import { getBalance } from "../utils/getBalance.js";
import { LoadingButton } from "@mui/lab";

const Home = () => {
  const { wallet, loading, balance, setBalance } = useWallet();
  const [loadingBalance, setLoadingBalance] = useState(false);
  const navigate = useNavigate();

  const refreshBalance = async () => {
    setLoadingBalance(true);
    const refreshedBalance = await getBalance(wallet[0].accountId);
    setBalance(refreshedBalance);
    setLoadingBalance(false);
  };

  useEffect(() => {
    WebApp.BackButton.hide();
  }, []);

  if (loading || !wallet || balance === null) {
    return <LoadingScreen />;
  }

  return (
    <Container>
      <Stack direction="row" justifyContent="space-between">
        <Stack direction="row">
          <IconButton onClick={() => navigate("/wallet")}>
            <SvgColor
              src="/icons/wallet.svg"
              width={35}
              height={35}
              color="#05A8DD"
            />
          </IconButton>

          <IconButton onClick={() => navigate("/history")}>
            <SvgColor
              src="/icons/history.svg"
              width={35}
              height={35}
              color="#05A8DD"
            />
          </IconButton>
        </Stack>
        <LoadingButton
          onClick={refreshBalance}
          loading={loadingBalance}
          sx={{
            minWidth: "auto",
            padding: 0,
            border: "none",
            backgroundColor: "transparent",
            "&.MuiButton-root": {
              minWidth: "auto",
              padding: 0,
              border: "none",
              backgroundColor: "transparent",
            },
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
        >
          <SvgColor
            src="/icons/refresh.svg"
            width={35}
            height={35}
            color="#05A8DD"
          />
        </LoadingButton>
      </Stack>
      <RotatingImage />
      <Typography variant="body1" paddingBottom={1}>
        {loadingBalance ? "Updating Balance... " : "Your Balance:"}
      </Typography>
      <Box
        padding={1}
        width={1}
        borderRadius={3}
        border="solid"
        textAlign="center"
      >
        {loadingBalance ? (
          <CircularProgress color="primary" />
        ) : (
          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="h5">{balance.toFixed(7)}</Typography>
            <Typography variant="body2">ICP</Typography>
          </Stack>
        )}
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
          startIcon={<SvgColor src="/icons/send.svg" />}
          onClick={() => navigate("/send")}
        >
          Transfer
        </Button>
        <Button
          variant="contained"
          fullWidth
          startIcon={
            <>
              <SvgColor src="/icons/receive.svg" />
            </>
          }
          onClick={() => navigate("/receive")}
        >
          Receive
        </Button>
      </Stack>
    </Container>
  );
};

export default Home;
