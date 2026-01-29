import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Paper,
  Box,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { removeFromCart, updateQuantity, clearCart } from "../redux/cartSlice";
import { orderApi } from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    const orderData = {
      restaurantId: cartItems[0].restaurantId,

      items: cartItems.map((item) => ({
        dishId: item.id,
        quantity: item.quantity,
      })),
    };

    console.log("Отправляем заказ:", orderData);

    try {
      const res = await orderApi.post("/orders", orderData);

      dispatch(clearCart());

      const orderId = res.data.id || res.data;
      navigate(`/order-status/${orderId}`);
    } catch (err) {
      console.error("Ошибка при заказе:", err);
      alert("Не удалось оформить заказ. Возможно, сервис недоступен.");
    }
  };

  const changeQuantity = (id, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty > 0) {
      dispatch(updateQuantity({ id, quantity: newQty }));
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container sx={{ mt: 10, textAlign: "center" }}>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Ваша корзина пуста
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate("/restaurants")}
        >
          Перейти к выбору еды
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        Корзина
      </Typography>

      <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Блюдо</TableCell>
              <TableCell align="center">Цена</TableCell>
              <TableCell align="center">Количество</TableCell>
              <TableCell align="center">Сумма</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cartItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {item.name}
                  </Typography>
                </TableCell>
                <TableCell align="center">{item.price} BYN</TableCell>
                <TableCell align="center">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => changeQuantity(item.id, item.quantity, -1)}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography sx={{ mx: 2, fontWeight: "bold" }}>
                      {item.quantity}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => changeQuantity(item.id, item.quantity, 1)}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: "bold", color: "primary.main" }}
                >
                  {item.price * item.quantity} BYN
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    color="error"
                    onClick={() => dispatch(removeFromCart(item.id))}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Divider sx={{ my: 3 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            pb: 2,
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Итого: <span style={{ color: "#BE6E46" }}>{totalPrice} BYN</span>
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{ px: 4, py: 1.5, fontSize: "1.1rem" }}
            onClick={handleCheckout}
          >
            Оформить заказ
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CartPage;
