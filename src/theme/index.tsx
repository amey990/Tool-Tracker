import React, { createContext, useContext, useMemo, useState } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import type { PaletteMode } from "@mui/material";
import { getTheme } from "./tokens";

type ThemeCtx = { mode: PaletteMode; toggle: () => void };
const ThemeModeContext = createContext<ThemeCtx>({ mode: "light", toggle: () => {} });
export const useThemeMode = () => useContext(ThemeModeContext);

export const AppThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  // Force light by default; ignore system
  const [mode, setMode] = useState<PaletteMode>(
    (localStorage.getItem("mode") as PaletteMode) || "light"
  );

  const theme = useMemo(() => getTheme(mode), [mode]);
  const toggle = () => {
    const next = mode === "light" ? "dark" : "light";
    localStorage.setItem("mode", next);
    setMode(next);
  };

  return (
    <ThemeModeContext.Provider value={{ mode, toggle }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};
