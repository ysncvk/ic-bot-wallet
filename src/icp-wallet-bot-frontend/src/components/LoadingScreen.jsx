import { Box, CircularProgress } from "@mui/material";

export default function LoadingScreen() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw", // Ekran genişliği kadar
        height: "100vh", // Ekran yüksekliği kadar
      }}
    >
      <CircularProgress color="primary" />
    </Box>
  );
}
