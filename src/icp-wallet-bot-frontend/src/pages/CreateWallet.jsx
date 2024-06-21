import React from "react";
import { Ed25519KeyIdentity } from "@dfinity/identity/lib/cjs/identity/ed25519";
import { AccountIdentifier } from "@dfinity/ledger-icp";
import { icp_wallet_bot_backend } from "declarations/icp-wallet-bot-backend";
import { Container, Typography, Box, Stack, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { useSnackbar } from "../components/snackbar";
import { useAuth } from "../components/AuthContext";

const CreateWallet = () => {
  const navigate = useNavigate();
  const { telegramId, userName } = useAuth();

  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const createWallet = async () => {
    setLoading(true);
    const identity = Ed25519KeyIdentity.generate();
    const publicKey = identity.getPublicKey().toDer();
    const privateKey = identity.getKeyPair().secretKey;
    const publicKeyBase64 = btoa(
      String.fromCharCode(...new Uint8Array(publicKey))
    );
    const privateKeyBase64 = btoa(
      String.fromCharCode(...new Uint8Array(privateKey))
    );
    const principal = identity.getPrincipal();

    const accountIdentifier = AccountIdentifier.fromPrincipal({ principal });
    console.log(
      "accountIdentifier:",
      accountIdentifier,
      "type:",
      typeof accountIdentifier
    );
    const accountId = accountIdentifier.toHex();

    const newWallet = {
      principalId: principal,
      accountId: accountId,
      publicKey: publicKeyBase64,
      privateKey: privateKeyBase64,
    };

    const result = await icp_wallet_bot_backend.createUser(
      telegramId,
      newWallet
    );

    console.log("result:", result);

    if (result) {
      console.log("resultın altı");
      enqueueSnackbar("Wallet is created...", { variant: "success" });
      navigate("/");
      setLoading(false);
    } else {
      enqueueSnackbar("There has been a problem please try agian later...");
    }
  };

  return (
    <Container>
      <Box
        component="img"
        src="/2.png"
        alt="ic-bot-wallet"
        sx={{
          width: "auto",
          maxHeight: "500px",
          objectFit: "scale-down",
        }}
      />
      <Stack
        direction="column"
        alignItems="center"
        justifyItems="center"
        gap={3}
        marginTop={3}
      >
        <Typography variant="h5">Welcome {userName}!</Typography>
        <Typography variant="body2">
          To get started, you need to create a new wallet.
        </Typography>
        <LoadingButton
          onClick={createWallet}
          variant="contained"
          fullWidth
          sx={{ padding: 2 }}
          loading={loading}
        >
          Create Wallet
        </LoadingButton>
      </Stack>
    </Container>
  );
};

export default CreateWallet;
