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
import { useNavigate, Link } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const loginRequest = {
      email: email,
      password: password,
    };

    try {
      const response = await authApi.post("/auth/login", loginRequest);
      dispatch(setCredentials(response.data));
      if (response.data.status === "DEACTIVATED") {
        navigate("/reactivate");
      } else {
        navigate("/restaurants");
      }
    } catch (err) {
      console.error(err);
      setError("Неверный email или пароль");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Typography variant="h4" align="center">
        Вход
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          fullWidth
          type="password"
          label="Пароль"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>
          Войти
        </Button>
        <Button component={Link} to="/register" fullWidth sx={{ mt: 1 }}>
          Нет аккаунта? Регистрация
        </Button>
      </Box>
    </Container>
  );
};

export default LoginPage;
