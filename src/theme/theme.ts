import { createTheme } from "@mui/material/styles";

export const APP_GRADIENT =
    "linear-gradient(135deg, rgba(25,118,210,1) 0%, rgba(156,39,176,0.95) 100%)";

export const theme = createTheme({
    shape: { borderRadius: 16 },
    typography: {
        fontFamily:
            '"Segoe UI", "Helvetica Neue", -apple-system, BlinkMacSystemFont, system-ui, Arial, sans-serif',
        h4: { fontWeight: 900, letterSpacing: -0.6 },
        h5: { fontWeight: 900, letterSpacing: -0.4 },
        h6: { fontWeight: 900, letterSpacing: -0.2 },
        button: { textTransform: "none", fontWeight: 800, letterSpacing: -0.2 },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                    border: "1px solid rgba(0,0,0,0.08)",
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                    border: "1px solid rgba(0,0,0,0.08)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                contained: {
                    backgroundImage: APP_GRADIENT,
                    boxShadow: "0 12px 28px rgba(25,118,210,0.22)",
                },
                outlined: {
                    borderWidth: "2px",
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 999,
                    fontWeight: 800,
                    whiteSpace: "nowrap",
                    "&:hover": {
                        boxShadow: "none !important",
                    },
                },
            },
        },
    },
});
