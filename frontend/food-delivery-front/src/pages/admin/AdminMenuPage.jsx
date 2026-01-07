import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Avatar,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import ConfirmDialog from "../../components/ConfirmDialog";

const RESTAURANT_URL = "http://localhost:9090";

const AdminMenuPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dishes, setDishes] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingDish, setEditingDish] = useState(null);

  const [deleteId, setDeleteId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [form, setForm] = useState({ name: "", description: "", price: "" });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const loadDishes = () => {
    restaurantApi
      .get(`/dishes/restaurant/${id}`)
      .then((res) => setDishes(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadDishes();
  }, [id]);

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${RESTAURANT_URL}${path}`;
  };

  const handleOpen = (dish = null) => {
    setEditingDish(dish);
    if (dish) {
      setForm({
        name: dish.name,
        description: dish.description,
        price: dish.price,
      });
      setPreviewUrl(getImageUrl(dish.imageUrl));
    } else {
      setForm({ name: "", description: "", price: "" });
      setPreviewUrl("");
    }
    setSelectedFile(null);
    setOpen(true);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      const dishRequest = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        restaurantId: id,
      };

      const jsonBlob = new Blob([JSON.stringify(dishRequest)], {
        type: "application/json",
      });
      formData.append("dish", jsonBlob);

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      if (editingDish) {
        await restaurantApi.put(`/dishes/${editingDish.id}`, formData);
      } else {
        await restaurantApi.post("/dishes", formData);
      }

      setOpen(false);
      loadDishes();
    } catch (e) {
      alert("Ошибка сохранения");
    }
  };

  const handleDeleteClick = (dishId) => {
    setDeleteId(dishId);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await restaurantApi.delete(`/dishes/${deleteId}`);
      loadDishes();
    } catch (e) {
      alert("Ошибка удаления");
    }
    setConfirmOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/admin/restaurants")}
        sx={{ mb: 2, color: "#59594A" }}
      >
        К списку ресторанов
      </Button>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 3,
          alignItems: "center",
        }}
      >
        <Typography variant="h4" fontWeight="bold" sx={{ color: "#59594A" }}>
          Управление меню
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          sx={{ px: 3 }}
        >
          Добавить блюдо
        </Button>
      </Box>

      <Paper sx={{ borderRadius: 3, overflow: "hidden", boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: "#59594A" }}>
            <TableRow>
              <TableCell sx={{ color: "#F9FBF6", fontWeight: "bold" }}>
                Фото
              </TableCell>
              <TableCell sx={{ color: "#F9FBF6", fontWeight: "bold" }}>
                Название
              </TableCell>
              <TableCell sx={{ color: "#F9FBF6", fontWeight: "bold" }}>
                Описание
              </TableCell>
              <TableCell sx={{ color: "#F9FBF6", fontWeight: "bold" }}>
                Цена
              </TableCell>
              <TableCell
                sx={{ color: "#F9FBF6", fontWeight: "bold" }}
                align="right"
              >
                Действия
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dishes.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                  sx={{ py: 4, color: "text.secondary" }}
                >
                  В этом ресторане пока нет блюд. Добавьте первое!
                </TableCell>
              </TableRow>
            ) : (
              dishes.map((dish) => (
                <TableRow key={dish.id} hover>
                  <TableCell>
                    <Avatar
                      src={getImageUrl(dish.imageUrl)}
                      variant="rounded"
                      sx={{
                        width: 60,
                        height: 60,
                        bgcolor: "#CDE7B0",
                        color: "#59594A",
                        fontWeight: "bold",
                      }}
                    >
                      {dish.name ? dish.name[0] : "?"}
                    </Avatar>
                  </TableCell>

                  <TableCell sx={{ fontWeight: "bold", color: "#59594A" }}>
                    {dish.name}
                  </TableCell>

                  <TableCell sx={{ maxWidth: 300, color: "text.secondary" }}>
                    {dish.description}
                  </TableCell>

                  <TableCell>
                    <Typography fontWeight="bold" color="primary">
                      {dish.price} ₽
                    </Typography>
                  </TableCell>

                  <TableCell align="right">
                    <Tooltip title="Редактировать">
                      <IconButton
                        onClick={() => handleOpen(dish)}
                        sx={{ color: "#BE6E46" }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Удалить">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(dish.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: "bold", color: "#59594A" }}>
          {editingDish ? "Редактировать блюдо" : "Новое блюдо"}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                src={previewUrl}
                variant="rounded"
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: "#F9FBF6",
                  border: "1px dashed #BE6E46",
                }}
              />
              <Box>
                <Button
                  component="label"
                  variant="outlined"
                  color="primary"
                  startIcon={<CloudUploadIcon />}
                  sx={{ mb: 1 }}
                >
                  Загрузить фото
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Button>
                {selectedFile && (
                  <Typography
                    variant="caption"
                    display="block"
                    noWrap
                    sx={{ maxWidth: 200 }}
                  >
                    {selectedFile.name}
                  </Typography>
                )}
              </Box>
            </Box>

            <TextField
              label="Название блюда"
              fullWidth
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <TextField
              label="Цена"
              type="number"
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₽</InputAdornment>
                ),
              }}
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />

            <TextField
              label="Описание"
              multiline
              rows={3}
              fullWidth
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              helperText="Ингредиенты, вес, особенности..."
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)} color="inherit">
            Отмена
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!form.name || !form.price}
          >
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Удаление блюда"
        content={`Вы действительно хотите удалить "${
          dishes.find((d) => d.id === deleteId)?.name
        }" из меню?`}
        confirmText="Удалить"
      />
    </Container>
  );
};

export default AdminMenuPage;
