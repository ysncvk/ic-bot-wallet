import { Box, CircularProgress, Container } from "@mui/material";
import React from "react";

export default function LoadingScreen() {
  return (
    <Container
      maxWidth="sm" // Adjust as needed for desired screen size
      sx={{
        display: "flex", // Enable flexbox for centering
        justifyContent: "center", // Center horizontally
        alignItems: "center", // Center vertically
        height: "100vh", // Fill viewport height for full-screen effect
      }}
    >
      <CircularProgress color="primary" />
    </Container>
  );
}
