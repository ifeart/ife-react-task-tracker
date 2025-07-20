import { useContext } from "react";
import { createRoot } from "react-dom/client";
import "./app/styles/index.css";
import App from "./app/App.tsx";
import { ThemeProvider, ThemeContext } from "@features/theme-switcher";
import { ThemeProvider as MUIThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import "@shared/config/i18n/index";

function AppTheme() {
  const { theme } = useContext(ThemeContext);

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </MUIThemeProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <>
    <ThemeProvider>
      <AppTheme />
    </ThemeProvider>
  </>
);
