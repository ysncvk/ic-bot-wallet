import React, { useState } from "react";
import { Box } from "@mui/material";
import { keyframes } from "@emotion/react";

// Define the rotation animation
const rotate360 = keyframes`
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
`;

const RotatingImage = () => {
  const [rotate, setRotate] = useState(false);

  const handleClick = () => {
    setRotate(true);
    setTimeout(() => setRotate(false), 1000); // Reset after 1 second (duration of the animation)
  };

  return (
    <Box
      component="img"
      src="/icbot.png"
      alt="ic-bot-wallet"
      sx={{
        width: "auto",
        maxHeight: "500px",
        objectFit: "scale-down",
        animation: rotate ? `${rotate360} 1s linear` : "none",
      }}
      onClick={handleClick}
    />
  );
};

export default RotatingImage;
