import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  Grid,
  TextField,
  Button,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import WarningIcon from "@mui/icons-material/Warning";
import { userApi } from "../../api/axiosConfig";
import { useDispatch } from "react-redux";
import { setCredentials, logout } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../ConfirmDialog";

const ProfileTab = ({ showMessage }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [fullNameInput, setFullNameInput] = useState("");

  const [nameError, setNameError] = useState("");

  const [openDeactivate, setOpenDeactivate] = useState(false);

  useEffect(() => {
    userApi
      .get("/users/me")
      .then((res) => {
        setUser(res.data);
        setFullNameInput(res.data.fullName);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleUpdateName = async () => {
    setNameError("");

    if (!fullNameInput.trim()) {
      setNameError("Имя не может быть пустым");
      return;
    }
    if (fullNameInput.length < 3) {
      setNameError("Минимум 3 символа");
      return;
    }
    if (fullNameInput.length > 100) {
      setNameError("Максимум 100 символов");
      return;
    }

    try {
      const res = await userApi.put("/users/me/fullname", {
        fullName: fullNameInput,
      });

      showMessage("success", "Профиль успешно обновлен");

      const token = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      dispatch(
        setCredentials({
          access_token: token,
          refresh_token: refreshToken,
          user: { fullName: res.data.fullName, email: res.data.email },
        })
      );
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Ошибка обновления профиля";
      showMessage("error", msg);
    }
  };

  const handleDeactivate = async () => {
    try {
      await userApi.patch("/users/me/deactivate");
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      showMessage("error", "Ошибка при деактивации");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4, py: 2 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          gap: 6,
        }}
      >
        <Box sx={{ textAlign: "center", minWidth: 200 }}>
          <Avatar
            sx={{
              width: 120,
              height: 120,
              bgcolor: "#BE6E46",
              fontSize: 48,
              mb: 2,
              margin: "0 auto",
              boxShadow: 3,
            }}
          >
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "?"}
          </Avatar>
          <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
            {user?.fullName}
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1, width: "100%" }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ mb: 3, fontWeight: "bold", color: "#59594A" }}
          >
            Основная информация
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Email"
                fullWidth
                value={user?.email || ""}
                disabled
                variant="filled"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Ваше Имя (ФИО)"
                fullWidth
                value={fullNameInput}
                onChange={(e) => setFullNameInput(e.target.value)}
                error={!!nameError}
                helperText={nameError || "От 3 до 100 символов"}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
                onClick={handleUpdateName}
                sx={{ mt: 1, px: 5 }}
              >
                Сохранить
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Box
        sx={{
          p: 3,
          border: "1px solid #ffcdd2",
          borderRadius: 2,
          bgcolor: "#fffEBEE",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 2,
            color: "error.main",
          }}
        >
          <WarningIcon />
          <Typography variant="h6" fontWeight="bold">
            Деактивация аккаунта
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Деактивация скроет ваш профиль и ограничит доступ к системе.
        </Typography>
        <Button
          variant="outlined"
          color="error"
          onClick={() => setOpenDeactivate(true)}
        >
          Деактивировать аккаунт
        </Button>
      </Box>

      <ConfirmDialog
        open={openDeactivate}
        onClose={() => setOpenDeactivate(false)}
        onConfirm={handleDeactivate}
        title="Деактивация аккаунта"
        content="Вы уверены? Ваш сеанс будет завершен."
        confirmText="Деактивировать"
      />
    </Box>
  );
};

export default ProfileTab;
