import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { orderApi } from "../api/axiosConfig";
import {
  Container,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Box,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PaymentIcon from "@mui/icons-material/Payment";
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PaymentDialog from "../components/PaymentDialog";

const steps = ["PLACED", "COOKING", "READY", "DELIVERED"];
const stepLabels = {
  PLACED: "Принят",
  COOKING: "Готовится",
  READY: "Готов / Курьер",
  DELIVERED: "Доставлен",
  CANCELLED: "Отменен",
};

const OrderStatusPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  const [isPaymentOpen, setPaymentOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const fetchStatus = () => {
    orderApi
      .get(`/orders/${id}`)
      .then((res) => setOrder(res.data))
      .catch((err) => console.error("Ошибка:", err));
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, [id]);

  if (!order)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  const activeStep = steps.indexOf(order.status);
  const isCancelled = order.status === "CANCELLED";

  // Заказ считается оплаченным, если бэк прислал PAID в DTO
  // или если только что успешно провели оплату на клиенте
  const isPaid = order.paymentStatus === "PAID" || paymentSuccess;

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      {paymentSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Оплата прошла успешно!
        </Alert>
      )}

      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
        {/* Хедер карточки */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Заказ #{id.substring(0, 8)}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mt: 1,
                color: "text.secondary",
              }}
            >
              <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="body2">
                {new Date(order.orderDate).toLocaleString("ru-RU")}
              </Typography>
            </Box>
          </Box>

          {/* Плашка статуса оплаты */}
          <Box>
            {isPaid ? (
              <Chip label="ОПЛАЧЕНО" color="success" variant="filled" />
            ) : isCancelled ? (
              <Chip label="ОТМЕНА" color="error" variant="filled" />
            ) : (
              <Chip label="К ОПЛАТЕ" color="warning" variant="outlined" />
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ textAlign: "center", my: 4 }}>
          <Typography variant="h3" color="primary" sx={{ fontWeight: "bold" }}>
            {order.totalPrice} BYN
          </Typography>
        </Box>

        {/* Stepper прогресса заказа */}
        {isCancelled ? (
          <Box sx={{ my: 4, textAlign: "center", color: "error.main" }}>
            <CancelIcon sx={{ fontSize: 60 }} />
            <Typography variant="h5" sx={{ mt: 1 }}>
              Заказ был отменен
            </Typography>
          </Box>
        ) : (
          <Box sx={{ my: 4 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{stepLabels[label]}</StepLabel>
                </Step>
              ))}
            </Stepper>
            {order.status === "DELIVERED" && (
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
              </Box>
            )}
          </Box>
        )}

        <Box sx={{ textAlign: "center", mt: 4 }}>
          {/* Кнопка "Оплатить" только если НЕ оплачено и НЕ отменено */}
          {!isPaid && !isCancelled && (
            <Button
              variant="contained"
              color="success"
              size="large"
              startIcon={<PaymentIcon />}
              onClick={() => setPaymentOpen(true)}
              sx={{ mr: 2, px: 4 }}
            >
              Оплатить
            </Button>
          )}

          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate("/orders")}
          >
            К списку заказов
          </Button>
        </Box>
      </Paper>

      {/* Оплата */}
      <PaymentDialog
        open={isPaymentOpen}
        onClose={() => setPaymentOpen(false)}
        orderId={id}
        onPaymentSuccess={() => {
          setPaymentSuccess(true);
          fetchStatus();
        }}
      />
    </Container>
  );
};

export default OrderStatusPage;
