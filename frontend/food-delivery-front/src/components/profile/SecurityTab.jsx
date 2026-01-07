import { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { userApi } from "../../api/axiosConfig";

const SecurityTab = ({ showMessage }) => {
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      showMessage("error", "Новые пароли не совпадают");
      return;
    }

    try {
      const payload = {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      };

      await userApi.put("/users/me/password", payload);

      showMessage("success", "Пароль успешно изменен");
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      showMessage("error", "Ошибка: проверьте старый пароль");
    }
  };

  return (
    <Box sx={{ maxWidth: 500, margin: "0 auto", py: 2 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#59594A" }}
      >
        Смена пароля
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Придумайте сложный пароль для защиты вашего аккаунта.
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 3 }}>
        <TextField
          label="Текущий пароль"
          type="password"
          fullWidth
          value={passwords.oldPassword}
          onChange={(e) =>
            setPasswords({ ...passwords, oldPassword: e.target.value })
          }
        />
        <TextField
          label="Новый пароль"
          type="password"
          fullWidth
          value={passwords.newPassword}
          onChange={(e) =>
            setPasswords({ ...passwords, newPassword: e.target.value })
          }
        />
        <TextField
          label="Подтвердите новый пароль"
          type="password"
          fullWidth
          value={passwords.confirmPassword}
          onChange={(e) =>
            setPasswords({ ...passwords, confirmPassword: e.target.value })
          }
        />
        <Button
          variant="contained"
          color="warning"
          size="large"
          onClick={handleChangePassword}
          sx={{ mt: 2 }}
        >
          Обновить пароль
        </Button>
      </Box>
    </Box>
  );
};

export default SecurityTab;
