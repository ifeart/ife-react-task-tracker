import { createContext, useState, useEffect } from "react";
import { darkTheme, lightTheme } from "../model/theme";

export type ThemeMode = "dark" | "light" | "system";

export const ThemeContext = createContext({
  theme: darkTheme,
  themeMode: "dark" as ThemeMode,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(
    (localStorage.getItem("themeMode") as ThemeMode) || "dark"
  );

  const [systemTheme, setSystemTheme] = useState<"dark" | "light">(
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => {
    const modes: ThemeMode[] = ["system", "light", "dark"];
    const currentIndex = modes.indexOf(themeMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];

    setThemeMode(nextMode);
    localStorage.setItem("themeMode", nextMode);
  };

  const effectiveTheme = themeMode === "system" ? systemTheme : themeMode;
  const theme = effectiveTheme === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, themeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
