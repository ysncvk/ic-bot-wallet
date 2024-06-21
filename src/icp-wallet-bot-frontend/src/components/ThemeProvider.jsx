// src/ThemeProvider.js

import React, {
  createContext,
  useMemo,
  useState,
  useContext,
  useEffect,
} from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import useTelegramTheme from "../hooks/useTelegramTheme.js";

const ThemeToggleContext = createContext();

export const useThemeToggle = () => useContext(ThemeToggleContext);

const ThemeProvider = ({ children }) => {
  const telegramTheme = "dark";
  // const telegramTheme = useTelegramTheme();
  const [isDarkMode, setIsDarkMode] = useState(telegramTheme === "dark");

  useEffect(() => {
    setIsDarkMode(telegramTheme === "dark");
  }, [telegramTheme]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? "dark" : "light",
        },
      }),
    [isDarkMode]
  );

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeToggleContext.Provider value={toggleTheme}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeToggleContext.Provider>
  );
};

export default ThemeProvider;
