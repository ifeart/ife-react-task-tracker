import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  InputAdornment,
  Paper,
} from "@mui/material";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { taskStore } from "@/entities/task/model";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {
      username: "",
      password: "",
      confirmPassword: "",
    };

    if (formData.username.length < 4) {
      newErrors.username = t("login.usernameMinLength");
    } else if (!/^[a-zA-Z0-9]+$/.test(formData.username)) {
      newErrors.username = t("login.usernameMinLength");
    }

    if (formData.password.length < 8) {
      newErrors.password = t("login.passwordMinLength");
    } else if (
      !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(formData.password)
    ) {
      newErrors.password = t("login.passwordMinLengthMatch");
    }

    if (mode === "register" && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t("login.passwordMatch");
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (mode === "login") {
        await taskStore.login({
          username: formData.username,
          password: formData.password,
        });
        navigate("/");
      } else {
        await taskStore.signUp({
          username: formData.username,
          password: formData.password,
        });

        await taskStore.login({
          username: formData.username,
          password: formData.password,
        });

        navigate("/");
      }
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  const handleInputChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: "",
        }));
      }
    };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          borderRadius: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            // mb: 3,
          }}
        >
          <Typography variant="h4" gutterBottom>
            {mode === "login" ? t("login.login") : t("login.register")}
          </Typography>

          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={(_, newMode) => newMode && setMode(newMode)}
            aria-label="authentication mode"
            sx={{ mb: 2 }}
          >
            <ToggleButton value="login">{t("login.login")}</ToggleButton>
            <ToggleButton value="register">{t("login.register")}</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <TextField
            label={t("login.username")}
            fullWidth
            value={formData.username}
            onChange={handleInputChange("username")}
            error={!!errors.username}
            helperText={errors.username}
          />

          <TextField
            label={t("login.password")}
            fullWidth
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleInputChange("password")}
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {mode === "register" && (
            <TextField
              label={t("login.confirmPassword")}
              fullWidth
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleInputChange("confirmPassword")}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}

          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            type="submit"
            sx={{ mt: 2 }}
          >
            {mode === "login" ? t("login.login") : t("login.register")}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
