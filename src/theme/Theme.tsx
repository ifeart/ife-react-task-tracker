import { createTheme } from "@mui/material/styles";

const baseTheme = {
  typography: {
    fontFamily: '"Futura", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
  },
};

export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: "dark",
    primary: { main: "#673ab7" },
    secondary: { main: "#d500f9" },
    background: { default: "#121212", paper: "#121212" },
  },
});
export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: "light",
    primary: { main: "#673ab7" },
    secondary: { main: "#f5f5f5" },
    background: { default: "#e2e2e2", paper: "#f2f2f2" },
  },
});
