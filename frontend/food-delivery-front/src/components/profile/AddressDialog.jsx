import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";

const AddressDialog = ({ open, onClose, onSave, initialData }) => {
  const [form, setForm] = useState({
    street: "",
    city: "",
    zip: "",
    state: "",
    country: "",
  });

  // При открытии форма заполняется либо очищается
  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({ street: "", city: "", zip: "", state: "", country: "" });
    }
  }, [initialData, open]);

  const handleSubmit = () => {
    if (!form.street || !form.city || !form.country) {
      alert("Пожалуйста, заполните обязательные поля");
      return;
    }
    onSave(form);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold" }}>
        {initialData ? "Редактировать адрес" : "Новый адрес"}
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          <TextField
            label="Улица, дом, кв. *"
            fullWidth
            value={form.street}
            onChange={(e) => setForm({ ...form, street: e.target.value })}
          />
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Город *"
              fullWidth
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
            <TextField
              label="Индекс (Zip)"
              fullWidth
              value={form.zip}
              onChange={(e) => setForm({ ...form, zip: e.target.value })}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Область / Штат *"
              fullWidth
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
            />
            <TextField
              label="Страна *"
              fullWidth
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          Отмена
        </Button>
        <Button onClick={handleSubmit} variant="contained" sx={{ px: 4 }}>
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddressDialog;
