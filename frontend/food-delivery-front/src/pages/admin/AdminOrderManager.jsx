import { useEffect, useState } from "react";
import { orderApi } from "../../api/axiosConfig";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Typography,
  Paper,
  Chip,
  IconButton,
  Box,
  Tabs,
  Tab,
  Tooltip,
  CircularProgress,
  Alert,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";
import KitchenIcon from "@mui/icons-material/Kitchen";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import HistoryIcon from "@mui/icons-material/History";
import ConfirmDialog from "../../components/ConfirmDialog";

const AdminOrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  const fetchOrders = () => {
    setLoading(true);
    orderApi
      .get("/orders")
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.content || [];
        setOrders(
          data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
        );
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Не удалось загрузить заказы");
        setLoading(false);
      });
  };

  // Автообновление каждую минуту
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 60000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await orderApi.patch(`/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (e) {
      alert("Ошибка обновления статуса");
    }
  };

  const getFilteredOrders = () => {
    if (tabIndex === 0) {
      return orders.filter((o) =>
        ["PLACED", "COOKING", "READY"].includes(o.status)
      );
    } else {
      return orders.filter((o) =>
        ["DELIVERED", "CANCELLED"].includes(o.status)
      );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("ru-RU", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusChip = (status) => {
    const map = {
      PLACED: { label: "PLACED", color: "error" },
      COOKING: { label: "COOKING", color: "warning" },
      READY: { label: "READY", color: "success" },
      DELIVERED: { label: "DELIVERED", color: "default" },
      CANCELLED: { label: "CANCELLED", color: "default" },
    };
    const conf = map[status] || { label: status, color: "default" };

    return (
      <Chip
        label={conf.label}
        color={conf.color}
        size="small"
        variant="filled"
        sx={{ fontWeight: "bold" }}
      />
    );
  };
  const renderActionButtons = (order) => {
    switch (order.status) {
      case "PLACED":
        return (
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<KitchenIcon />}
            onClick={() => updateStatus(order.id, "COOKING")}
            sx={{ mr: 1 }}
          >
            На кухню
          </Button>
        );
      case "COOKING":
        return (
          <Button
            variant="contained"
            color="warning"
            size="small"
            startIcon={<LocalShippingIcon />}
            onClick={() => updateStatus(order.id, "READY")}
            sx={{ mr: 1, color: "white" }}
          >
            Готово
          </Button>
        );
      case "READY":
        return (
          <Button
            variant="contained"
            color="success"
            size="small"
            startIcon={<DoneAllIcon />}
            onClick={() => updateStatus(order.id, "DELIVERED")}
            sx={{ mr: 1 }}
          >
            Вручено
          </Button>
        );
      default:
        return null;
    }
  };

  const handleCancelClick = (orderId) => {
    setOrderToCancel(orderId);
    setConfirmOpen(true);
  };

  const handleConfirmCancel = () => {
    if (orderToCancel) {
      updateStatus(orderToCancel, "CANCELLED");
    }
    setConfirmOpen(false);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Заголовок и кнопка обновления */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: "#59594A" }}>
            Центр управления заказами
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Всего заказов: {orders.length}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchOrders}
        >
          Обновить
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ borderRadius: 3, overflow: "hidden", boxShadow: 3 }}>
        {/* Вкладки */}
        <Tabs
          value={tabIndex}
          onChange={(e, v) => setTabIndex(v)}
          indicatorColor="primary"
          textColor="primary"
          sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "#F9FBF6" }}
        >
          <Tab
            icon={<PendingActionsIcon />}
            label={`Активные (${
              orders.filter((o) =>
                ["PLACED", "COOKING", "READY"].includes(o.status)
              ).length
            })`}
            iconPosition="start"
          />
          <Tab icon={<HistoryIcon />} label="История" iconPosition="start" />
        </Tabs>

        {loading ? (
          <Box sx={{ p: 5, textAlign: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead sx={{ bgcolor: "#59594A" }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  ID / Время
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Статус
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Оплата
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Сумма
                </TableCell>
                <TableCell
                  sx={{ color: "white", fontWeight: "bold" }}
                  align="right"
                >
                  Действия
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getFilteredOrders().length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{ py: 4, color: "text.secondary" }}
                  >
                    В этом разделе пока нет заказов
                  </TableCell>
                </TableRow>
              ) : (
                getFilteredOrders().map((order) => (
                  <TableRow
                    key={order.id}
                    hover
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    {/* ID и Дата */}
                    <TableCell>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontFamily: "monospace", fontWeight: "bold" }}
                      >
                        #{order.id.substring(0, 6)}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          color: "text.secondary",
                          mt: 0.5,
                        }}
                      >
                        <AccessTimeIcon sx={{ fontSize: 14, mr: 0.5 }} />
                        <Typography variant="caption">
                          {formatDate(order.orderDate)}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Статус Заказа */}
                    <TableCell>{getStatusChip(order.status)}</TableCell>

                    {/* Статус Оплаты */}
                    <TableCell>
                      {order.paymentStatus === "PAID" ? (
                        <Chip
                          label="ОПЛАЧЕНО"
                          color="success"
                          size="small"
                          variant="outlined"
                        />
                      ) : (
                        <Chip
                          label="НЕ ОПЛАЧЕНО"
                          color="warning"
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </TableCell>

                    {/* Сумма */}
                    <TableCell>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        color="primary"
                      >
                        {order.totalPrice} BYN
                      </Typography>
                    </TableCell>

                    {/* Кнопки действий */}
                    <TableCell align="right">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "center",
                        }}
                      >
                        {/* Главная кнопка шага */}
                        {renderActionButtons(order)}

                        {/* Кнопка отмены */}
                        {order.status !== "DELIVERED" &&
                          order.status !== "CANCELLED" && (
                            <Tooltip title="Отменить заказ">
                              <IconButton
                                color="error"
                                onClick={() => handleCancelClick(order.id)}
                              >
                                <CancelIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Paper>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Отмена заказа"
        content="Вы уверены, что хотите отменить этот заказ? Это действие нельзя будет отменить."
        confirmText="Да, отменить"
      />
    </Container>
  );
};

export default AdminOrderManager;
