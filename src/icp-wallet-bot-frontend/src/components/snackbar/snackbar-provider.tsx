"use client";

import { useRef } from "react";
import {
  closeSnackbar,
  SnackbarProvider as NotistackProvider,
} from "notistack";

import IconButton from "@mui/material/IconButton";
import { Icon } from "@iconify/react";

import { StyledIcon, StyledNotistack } from "./styles";
import SvgColor from "../svg-color";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function SnackbarProvider({ children }: Props) {
  const notistackRef = useRef<any>(null);

  return (
    <NotistackProvider
      ref={notistackRef}
      maxSnack={5}
      preventDuplicate
      autoHideDuration={3000}
      variant="success" // Set default variant
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      iconVariant={{
        info: (
          <StyledIcon color="info">
            <Icon icon="eva:info-fill" width={24} />
          </StyledIcon>
        ),
        success: (
          <StyledIcon color="success">
            <SvgColor src="/icons/check.svg" />
          </StyledIcon>
        ),
        warning: (
          <StyledIcon color="warning">
            <Icon icon="eva:alert-triangle-fill" width={24} />
          </StyledIcon>
        ),
        error: (
          <StyledIcon color="error">
            <SvgColor src="/icons/danger.svg" />
          </StyledIcon>
        ),
      }}
      Components={{
        default: StyledNotistack,
        info: StyledNotistack,
        success: StyledNotistack,
        warning: StyledNotistack,
        error: StyledNotistack,
      }}
      // with close as default
      action={(snackbarId) => (
        <IconButton
          size="small"
          onClick={() => closeSnackbar(snackbarId)}
          sx={{ p: 0.5 }}
        >
          <SvgColor src="/icons/close.svg" width={16} height={16} />
        </IconButton>
      )}
    >
      {children}
    </NotistackProvider>
  );
}
