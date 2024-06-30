import { forwardRef } from "react";

import Box, { BoxProps } from "@mui/material/Box";

// ----------------------------------------------------------------------

export interface SvgColorProps extends BoxProps {
  src: string;
  width?: number;
  height?: number;
}

const SvgColor = forwardRef<HTMLSpanElement, SvgColorProps>(
  ({ width = 24, height = 24, src, sx, ...other }, ref) => (
    <Box
      component="span"
      className="svg-color"
      ref={ref}
      sx={{
        width: width,
        height: height,
        display: "inline-block",
        bgcolor: "currentColor",
        mask: `url(${src}) no-repeat center / contain`,
        WebkitMask: `url(${src}) no-repeat center / contain`,
        ...sx,
      }}
      {...other}
    />
  )
);

export default SvgColor;
