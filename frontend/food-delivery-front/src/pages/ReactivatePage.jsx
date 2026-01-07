import { Container, Paper, Typography, Button, Box } from "@mui/material";
import { userApi, authApi } from "../api/axiosConfig";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";

const ReactivatePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleActivate = async () => {
    try {
      await userApi.patch("/users/me/activate");

      const currentRefreshToken = localStorage.getItem("refreshToken");

      if (!currentRefreshToken) {
        throw new Error("No refresh token found");
      }

      const refreshResponse = await authApi.post("/auth/refresh", {
        token: currentRefreshToken,
      });

      dispatch(setCredentials(refreshResponse.data));

      navigate("/restaurants");
    } catch (error) {
      console.error("Activation error:", error);
      navigate("/login");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper
        elevation={3}
        sx={{
          p: 5,
          textAlign: "center",
          borderRadius: 4,
          bgcolor: "#F9FBF6",
          border: "1px solid #E0E0E0",
        }}
      >
        <SentimentDissatisfiedIcon
          sx={{ fontSize: 80, color: "#7286A0", mb: 2 }}
        />

        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          sx={{ color: "#59594A" }}
        >
          Аккаунт отключен
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          paragraph
          sx={{ mb: 4 }}
        >
          Вы отключили свой профиль. Чтобы снова делать заказы, нажмите кнопку
          ниже для восстановления доступа.
        </Typography>

        <Button
          variant="contained"
          size="large"
          color="primary"
          onClick={handleActivate}
          sx={{ px: 5, py: 1.5, borderRadius: 2 }}
        >
          Активировать аккаунт
        </Button>
      </Paper>
    </Container>
  );
};

export default ReactivatePage;
