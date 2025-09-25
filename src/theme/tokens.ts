import { createTheme } from "@mui/material";
import type { PaletteMode } from "@mui/material";

const DARK_BG = "#0F0F0F";
const DARK_CARD = "#1C1C1E";

const LIGHT_BG = "#FFFFFF";
const LIGHT_CARD = "#F5F5F7";

export const getTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      primary: { main: "#1565c0" },
      secondary: { main: "#6d4c41" },

      ...(mode === "dark"
        ? {
            background: {
              default: DARK_BG, // page, body
              paper: DARK_BG,   // navbar, sidebar (paper-based)
            },
            text: {
              primary: "rgba(255,255,255,0.92)",
              secondary: "rgba(255,255,255,0.64)",
            },
            divider: "rgba(255,255,255,0.08)",
          }
        : {
            background: {
              default: LIGHT_BG, // page, body
              paper: LIGHT_BG,   // navbar, sidebar (paper-based)
            },
            text: {
              primary: "rgba(0,0,0,0.92)",
              secondary: "rgba(0,0,0,0.62)",
            },
            divider: "rgba(0,0,0,0.08)",
          }),
    },

    shape: { borderRadius: 12 },

    typography: {
      fontFamily:
        'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"',
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
    },

    // Component-level colors to match your spec
    components: {
      // Use our chrome background for bars & rail

      MuiTextField: {
    defaultProps: { fullWidth: true, size: "small" },   // compact everywhere
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 8,           // boxy (not round)
        height: 36,                // smaller control height
      },
      input: {
        paddingTop: 0.5,           // tighten vertical padding
        paddingBottom: 0.5,
      },
    },
  },

      MuiAppBar: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            boxShadow: "none",
            borderBottom: `1px solid ${theme.palette.divider}`,
          }),
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: ({ theme }) => ({
            backgroundColor: theme.palette.background.paper, // navbar/sidebar background
            color: theme.palette.text.primary,
            borderRight: `1px solid ${theme.palette.divider}`,
          }),
        },
      },

      // Cards should follow the "card color" per mode
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: theme.palette.mode === "dark" ? DARK_CARD : LIGHT_CARD,
            borderRadius: 12,
            boxShadow: "none",
            border: `1px solid ${theme.palette.divider}`,
          }),
        },
      },
      MuiPaper: {
        defaultProps: { elevation: 0 }, // keep it flat by default
        styleOverrides: {
          // Only change bg when Paper is used as a "card" (variant="outlined" or elevation>0).
          // For plain layout containers (like toolbars/rails) we keep background.paper.
          root: ({ ownerState, theme }) => {
            const isCardLike =
              ownerState.variant === "outlined" || (ownerState.elevation ?? 0) > 0;
            return isCardLike
              ? {
                  backgroundColor:
                    theme.palette.mode === "dark" ? DARK_CARD : LIGHT_CARD,
                  borderRadius: 12,
                  border: `1px solid ${theme.palette.divider}`,
                }
              : {};
          },
        },
      },

      // Inputs & buttons subtle rounding
     MuiIconButton: {
    styleOverrides: { root: { borderRadius: 8, padding: 6 } },
  },

      MuiButton: {
        styleOverrides: {
          root: { textTransform: "none", borderRadius: 24, boxShadow: "none" },
          contained: {
            boxShadow: "none",
            "&:hover": { boxShadow: "none" },
          },
        },
      },
     
      MuiToolbar: {
    defaultProps: { variant: "dense" },
    styleOverrides: {
      root: {
        minHeight: 54,
        "@media (min-width:0px)": { minHeight: 54 },
        "@media (min-width:600px)": { minHeight: 54 },
      },
    },
  },
    },
  });
