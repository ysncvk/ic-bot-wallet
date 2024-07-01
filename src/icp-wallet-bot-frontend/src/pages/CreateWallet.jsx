import React, { useState } from "react";
import { Ed25519KeyIdentity } from "@dfinity/identity/lib/cjs/identity/ed25519";
import { AccountIdentifier } from "@dfinity/ledger-icp";
import { icp_wallet_bot_backend } from "declarations/icp-wallet-bot-backend";
import { Container, Typography, Box, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import { useSnackbar } from "../components/snackbar";
import { useAuth } from "../components/AuthContext";
import { encrypt } from "../utils/cryptoUtils";

const CreateWallet = () => {
  const { telegramId, userName, setIsUser } = useAuth();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const createWallet = async () => {
    setLoading(true);
    try {
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
      const accountId = accountIdentifier.toHex();

      // Salt oluştur
      const saltArray = new Uint8Array(16);
      window.crypto.getRandomValues(saltArray);
      const salt = btoa(String.fromCharCode(...saltArray));

      // Şifreli private key
      const encryptedPrivateKey = encrypt(
        privateKeyBase64,
        telegramId.toString(),
        salt
      );

      const newWallet = {
        principalId: principal,
        accountId: accountId,
        publicKey: publicKeyBase64,
        privateKey: encryptedPrivateKey,
        salt: salt,
        tokens: ["ICP"],
      };

      const result = await icp_wallet_bot_backend.createUser(
        telegramId,
        newWallet
      );

      if (result) {
        enqueueSnackbar("Your wallet is created...", { variant: "success" });
        setLoading(false);
        setIsUser(true);
        navigate("/");
      } else {
        enqueueSnackbar("There has been a problem please try again later...", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error creating wallet:", error);
      enqueueSnackbar(
        "An error occurred while creating the wallet. Please try again later.",
        { variant: "error" }
      );
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
