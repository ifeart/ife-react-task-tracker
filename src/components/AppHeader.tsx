import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MoreIcon from "@mui/icons-material/MoreVert";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../theme/ThemeContext";
import BrightnessAutoIcon from "@mui/icons-material/BrightnessAuto";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import LanguageIcon from "@mui/icons-material/Language";
import { useTranslation } from "react-i18next";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "auto",
  },
  [theme.breakpoints.down("sm")]: {
    margin: theme.spacing(0, 1),
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
}));

export default function AppHeader() {
  const { theme, themeMode, toggleTheme } = React.useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [mobileMenuAnchor, setMobileMenuAnchor] =
    React.useState<null | HTMLElement>(null);
  const [languageMenuAnchor, setLanguageMenuAnchor] =
    React.useState<null | HTMLElement>(null);

  const isMobileMenuOpen = Boolean(mobileMenuAnchor);
  const isLanguageMenuOpen = Boolean(languageMenuAnchor);

  const getThemeIcon = () => {
    switch (themeMode) {
      case "system":
        return <BrightnessAutoIcon />;
      case "light":
        return <LightModeIcon />;
      case "dark":
        return <DarkModeIcon />;
      default:
        return <DarkModeIcon />;
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    setLanguageMenuAnchor(null);
    setMobileMenuAnchor(null);
  };

  const languageMenu = (
    <Menu
      anchorEl={languageMenuAnchor}
      open={isLanguageMenuOpen}
      onClose={() => setLanguageMenuAnchor(null)}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <MenuItem onClick={() => handleLanguageChange("ru")}>
        {t("ui.ru")}
      </MenuItem>
      <MenuItem onClick={() => handleLanguageChange("en")}>
        {t("ui.en")}
      </MenuItem>
    </Menu>
  );

  const mobileMenu = (
    <Menu
      anchorEl={mobileMenuAnchor}
      open={isMobileMenuOpen}
      onClose={() => setMobileMenuAnchor(null)}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <MenuItem onClick={toggleTheme}>
        <IconButton size="large" color="inherit">
          {getThemeIcon()}
        </IconButton>
        <p>{t("ui.toogleTheme")}</p>
      </MenuItem>
      <MenuItem onClick={(e) => setLanguageMenuAnchor(e.currentTarget)}>
        <IconButton size="large" color="inherit">
          <LanguageIcon />
        </IconButton>
        <p>{t("ui.language")}</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box
      sx={{
        flexGrow: 1,
        position: "sticky",
        top: "10px",
        borderRadius: "10px",
        margin: "10px",
        zIndex: 2,
        backdropFilter: "blur(4px)",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
      }}
    >
      <AppBar
        sx={{
          borderRadius: "10px",
          backgroundColor:
            theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : null,
          position: {
            xs: "static",
            sm: "sticky",
          },
          top: 0,
          zIndex: theme.zIndex.appBar,
        }}
      >
        <Toolbar>
          <Link to={"/"}>
            <Box
              component="img"
              src="/img/logo.svg"
              alt="Logo"
              sx={{
                height: 40,
                mr: 2,
                display: { xs: "block" },
              }}
            />
          </Link>

          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: {
                xs: "center",
                sm: "center",
                md: "flex-start",
              },
            }}
          >
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder={t("ui.searchTasks")}
                inputProps={{ "aria-label": "search" }}
                inputRef={searchInputRef}
                onChange={(e) => {
                  if (e.target.value.length > 0) {
                    console.log(e.target.value);
                    {
                      /* не успеваю доделать :(*/
                    }
                  }
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: alpha(theme.palette.common.white, 0.15),
                  borderRadius: 2,
                  px: 0.5,
                  fontSize: "0.75rem",
                  display: { xs: "none", sm: "block" },
                }}
              >
                {navigator.platform.includes("Mac") ? "⌘K" : "Ctrl+K"}
              </Box>
            </Search>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              maxWidth: "fit-content",
              justifyContent: "flex-end",
              flexGrow: { xs: 1, sm: 0 },
            }}
          >
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <IconButton size="large" color="inherit" onClick={toggleTheme}>
                {getThemeIcon()}
              </IconButton>
              <IconButton
                size="large"
                color="inherit"
                onClick={(e) => setLanguageMenuAnchor(e.currentTarget)}
              >
                <LanguageIcon />
              </IconButton>
              {/* Оставлю на будущее, если будет нужно, пока не работает :) */}
              {/* <IconButton size="large" color="inherit">
                <AccountCircle />
              </IconButton> */}
            </Box>

            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                color="inherit"
                onClick={(e) => setMobileMenuAnchor(e.currentTarget)}
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      {mobileMenu}
      {languageMenu}
    </Box>
  );
}
