import Box from "@mui/material/Box";
import { Link, Paper, Stack, Typography } from "@mui/material";
import { fDate } from "../utils/fDate.js";
import { useWallet } from "./WalletContext.jsx";
import Label from "./label/";

// ----------------------------------------------------------------------

export default function HistoryItem({ row }) {
  const { id, transaction } = row;
  const { wallet } = useWallet();

  const url = `https://dashboard.internetcomputer.org/transaction/${Number(
    id
  ).toString()}`;

  return (
    <Box
      component={Paper}
      width={1}
      borderRadius={2}
      border="solid"
      borderColor="aliceblue"
      padding={0.5}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ p: 1 }}
      >
        <Typography variant="caption">
          <Link href={url} target="_blank" rel="noopener noreferrer">
            {Number(id).toString()}
          </Link>
        </Typography>
        <Typography variant="caption">
          {(
            Number(transaction?.operation?.Transfer?.amount?.e8s) / 100_000_000
          ).toFixed(5)}{" "}
          ICP
        </Typography>
      </Stack>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ p: 1 }}
      >
        <Typography variant="caption">
          {fDate(transaction?.created_at_time[0].timestamp_nanos)}
        </Typography>
        <Label
          variant="soft"
          color={
            wallet[0].accountId === transaction?.operation?.Transfer?.from
              ? "error"
              : "success"
          }
        >
          {wallet[0].accountId === transaction?.operation?.Transfer?.from
            ? "Transfer"
            : "Deposit"}
        </Label>
      </Stack>
    </Box>
  );
}
