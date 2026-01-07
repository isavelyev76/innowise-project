import { useEffect, useState } from "react";
import { orderApi } from "../api/axiosConfig";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";

const UserOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    orderApi
      .get("/orders/my")
      .then((res) => {
        const sorted = res.data.sort(
          (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
        );
        setOrders(sorted);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getOrderStatusColor = (status) => {
    switch (status) {
      case "PLACED":
        return "default";
      case "COOKING":
        return "info";
      case "READY":
        return "warning";
      case "DELIVERED":
        return "success";
      case "CANCELLED":
        return "error";
      default:
        return "default";
    }
  };

  // Форматирование даты
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        История заказов
      </Typography>

      {orders.length === 0 ? (
        <Typography variant="h6" color="text.secondary" align="center">
          История заказов пуста
        </Typography>
      ) : (
        <Paper sx={{ borderRadius: 3, overflowX: "auto", boxShadow: 3 }}>
          <Table>
            <TableHead sx={{ bgcolor: "#59594A" }}>
              <TableRow>
                <TableCell sx={{ color: "white" }}>Дата</TableCell>
                <TableCell sx={{ color: "white" }}>Номер</TableCell>
                <TableCell sx={{ color: "white" }}>Статус заказа</TableCell>
                <TableCell sx={{ color: "white" }}>Оплата</TableCell>
                <TableCell sx={{ color: "white" }}>Сумма</TableCell>
                <TableCell sx={{ color: "white" }} align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>{formatDate(order.orderDate)}</TableCell>
                  <TableCell sx={{ fontFamily: "monospace" }}>
                    #{order.id.substring(0, 6)}
                  </TableCell>

                  {/* Статус жизненного цикла (готовится, доставляется) */}
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={getOrderStatusColor(order.status)}
                      size="small"
                      variant="filled"
                    />
                  </TableCell>

                  {/* Статус оплаты */}
                  <TableCell>
                    {order.paymentStatus === "PAID" ? (
                      <Chip
                        label="ОПЛАЧЕНО"
                        color="success"
                        size="small"
                        variant="outlined"
                      />
                    ) : order.status === "CANCELLED" ? (
                      <Chip
                        label="ОТМЕНА"
                        color="error"
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

                  <TableCell>{order.totalPrice} ₽</TableCell>

                  <TableCell align="right">
                    <Button
                      variant="text"
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => navigate(`/order-status/${order.id}`)}
                    >
                      Детали
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Container>
  );
};

export default UserOrdersPage;
