import { StrictMode, useContext } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./theme/ThemeContext.tsx";
import { ThemeProvider as MUIThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { ThemeContext } from "./theme/ThemeContext.tsx";
import "./data/i18n/i18n.tsx";

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
  <StrictMode>
    <ThemeProvider>
      <AppTheme />
    </ThemeProvider>
  </StrictMode>
);
