import { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { authApi } from "../api/axiosConfig";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [globalError, setGlobalError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: null });
    }
  };

  const validate = () => {
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = "ФИО обязательно";
    } else if (formData.fullName.length < 3) {
      errors.fullName = "Имя должно быть не менее 3 символов";
    } else if (formData.fullName.length > 100) {
      errors.fullName = "Имя слишком длинное (макс 100)";
    }

    if (!formData.email.trim()) {
      errors.email = "Email обязателен";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Некорректный формат email";
    }

    if (!formData.password) {
      errors.password = "Пароль обязателен";
    } else if (formData.password.length < 6) {
      errors.password = "Пароль должен быть не менее 6 символов";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Пароли не совпадают";
    }

    return errors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setGlobalError("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    try {
      const requestBody = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      };

      const response = await authApi.post("/auth/register", requestBody);

      dispatch(setCredentials(response.data));
      navigate("/restaurants");
    } catch (err) {
      console.error("Registration Error:", err);

      if (err.response) {
        const backendMsg =
          err.response.data?.message ||
          err.response.data?.error ||
          "Ошибка регистрации";

        setGlobalError(backendMsg);
      } else {
        setGlobalError("Сервер не отвечает. Попробуйте позже.");
      }
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8, mb: 4 }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#59594A" }}
      >
        Регистрация
      </Typography>

      {globalError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {globalError}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleRegister}
        sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          fullWidth
          name="fullName"
          label="ФИО"
          value={formData.fullName}
          onChange={handleChange}
          error={!!fieldErrors.fullName}
          helperText={fieldErrors.fullName}
        />

        <TextField
          fullWidth
          name="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={!!fieldErrors.email}
          helperText={fieldErrors.email}
        />

        <TextField
          fullWidth
          name="password"
          label="Пароль"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={!!fieldErrors.password}
          helperText={fieldErrors.password}
        />

        <TextField
          fullWidth
          name="confirmPassword"
          label="Подтвердите пароль"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={!!fieldErrors.confirmPassword}
          helperText={fieldErrors.confirmPassword}
        />

        <Button
          fullWidth
          variant="contained"
          size="large"
          type="submit"
          sx={{ mt: 1 }}
        >
          Зарегистрироваться
        </Button>
        <Button
          onClick={() => navigate("/login")}
          sx={{ textTransform: "none" }}
        >
          Уже есть аккаунт? Войти
        </Button>
      </Box>
    </Container>
  );
};

export default RegisterPage;
