import { useEffect, useState } from "react";
import { restaurantApi } from "../../api/axiosConfig";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import { useNavigate } from "react-router-dom";

const AdminRestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingRest, setEditingRest] = useState(null);
  const [form, setForm] = useState({ name: "", cuisine: "", address: "" });
  const navigate = useNavigate();

  const loadRestaurants = () => {
    restaurantApi.get("/restaurants?size=100").then((res) => {
      const data = res.data.content ? res.data.content : res.data;
      setRestaurants(data);
    });
  };

  useEffect(() => {
    loadRestaurants();
  }, []);

  const handleOpen = (rest = null) => {
    setEditingRest(rest);
    setForm(
      rest
        ? { name: rest.name, cuisine: rest.cuisine, address: rest.address }
        : { name: "", cuisine: "", address: "" }
    );
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingRest) {
        await restaurantApi.put(`/restaurants/${editingRest.id}`, form);
      } else {
        await restaurantApi.post("/restaurants", form);
      }
      setOpen(false);
      loadRestaurants();
    } catch (e) {
      alert("Ошибка сохранения");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Удалить ресторан? Это удалит и всё его меню!")) {
      try {
        await restaurantApi.delete(`/restaurants/${id}`);
        loadRestaurants();
      } catch (e) {
        alert("Ошибка удаления");
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Управление ресторанами
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Добавить ресторан
        </Button>
      </Box>

      <Paper sx={{ borderRadius: 2, overflow: "hidden", boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: "#59594A" }}>
            <TableRow>
              <TableCell sx={{ color: "white" }}>Название</TableCell>
              <TableCell sx={{ color: "white" }}>Кухня</TableCell>
              <TableCell sx={{ color: "white" }}>Адрес</TableCell>
              <TableCell sx={{ color: "white" }} align="right">
                Действия
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {restaurants.map((rest) => (
              <TableRow key={rest.id} hover>
                <TableCell sx={{ fontWeight: "bold" }}>{rest.name}</TableCell>
                <TableCell>{rest.cuisine}</TableCell>
                <TableCell>{rest.address}</TableCell>
                <TableCell align="right">
                  {/* Кнопка перехода к блюдам */}
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<RestaurantMenuIcon />}
                    onClick={() =>
                      navigate(`/admin/restaurants/${rest.id}/menu`)
                    }
                    sx={{ mr: 2 }}
                  >
                    Меню
                  </Button>

                  <IconButton color="primary" onClick={() => handleOpen(rest)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(rest.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Создание / редактирование */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editingRest ? "Редактировать" : "Новый ресторан"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Название"
              fullWidth
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <TextField
              label="Кухня"
              fullWidth
              value={form.cuisine}
              onChange={(e) => setForm({ ...form, cuisine: e.target.value })}
            />
            <TextField
              label="Адрес"
              fullWidth
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)}>Отмена</Button>
          <Button variant="contained" onClick={handleSave}>
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminRestaurantsPage;
