import { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { userApi } from "../../api/axiosConfig";
import AddressDialog from "./AddressDialog";
import ConfirmDialog from "../ConfirmDialog";

const AddressesTab = ({ showMessage }) => {
  const [addresses, setAddresses] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);

  const loadAddresses = () => {
    userApi.get("/addresses").then((res) => setAddresses(res.data));
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleSave = async (formData) => {
    try {
      if (editingAddress) {
        await userApi.put(`/addresses/${editingAddress.id}`, formData);
        showMessage("success", "Адрес обновлен");
      } else {
        await userApi.post("/addresses", formData);
        showMessage("success", "Адрес добавлен");
      }
      setDialogOpen(false);
      loadAddresses();
    } catch (err) {
      showMessage("error", "Ошибка сохранения адреса");
    }
  };

  // 1 - Нажатие на иконку удаления
  const clickDelete = (id) => {
    setDeleteId(id);
    setOpenConfirm(true);
  };

  // 2 - Реальное удаление
  const confirmDelete = async () => {
    try {
      await userApi.delete(`/addresses/${deleteId}`);
      loadAddresses();
      showMessage("success", "Адрес удален");
    } catch (e) {
      showMessage("error", "Не удалось удалить адрес");
    }
    setOpenConfirm(false);
  };

  const openDialog = (addr = null) => {
    setEditingAddress(addr);
    setDialogOpen(true);
  };

  return (
    <Box sx={{ py: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card
            variant="outlined"
            onClick={() => openDialog()}
            sx={{
              height: 180,
              borderStyle: "dashed",
              borderWidth: 2,
              borderColor: "#BE6E46",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              transition: "0.2s",
              bgcolor: "transparent",
              "&:hover": { bgcolor: "rgba(190, 110, 70, 0.05)" },
            }}
          >
            <AddIcon sx={{ fontSize: 40, color: "#BE6E46", mb: 1 }} />
            <Typography variant="h6" color="primary" fontWeight="bold">
              Добавить новый адрес
            </Typography>
          </Card>
        </Grid>

        {/* Список адресов */}
        {addresses.map((addr) => (
          <Grid item xs={12} md={6} key={addr.id}>
            <Card
              elevation={2}
              sx={{
                height: 180,
                position: "relative",
                transition: "0.2s",
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    mb: 1,
                  }}
                >
                  <Chip
                    label={addr.country}
                    size="small"
                    sx={{ bgcolor: "#CDE7B0", fontWeight: "bold" }}
                  />
                  <Box>
                    <IconButton size="small" onClick={() => openDialog(addr)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => clickDelete(addr.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Typography
                  variant="h6"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ mt: 1 }}
                >
                  {addr.city}
                </Typography>

                <Typography variant="body1" noWrap title={addr.street}>
                  {addr.street}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {addr.state} {addr.zip && `(${addr.zip})`}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <AddressDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        initialData={editingAddress}
      />

      <ConfirmDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={confirmDelete}
        title="Удаление адреса"
        content="Вы действительно хотите удалить этот адрес доставки?"
        confirmText="Удалить"
      />
    </Box>
  );
};

export default AddressesTab;
