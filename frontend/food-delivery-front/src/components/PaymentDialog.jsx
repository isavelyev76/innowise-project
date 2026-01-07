import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
} from "@mui/material";
import { orderApi } from "../api/axiosConfig";

const PaymentDialog = ({ open, onClose, orderId, onPaymentSuccess }) => {
  const [method, setMethod] = useState("CARD");
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      await orderApi.post(`/payments/order/${orderId}/payment`, { method });

      setLoading(false);
      onPaymentSuccess();
      onClose();
    } catch (error) {
      console.error("Ошибка оплаты", error);
      alert("Ошибка при оплате. Попробуйте позже.");
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
        Оплата заказа
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Выберите способ оплаты:
        </Typography>
        <FormControl component="fieldset">
          <RadioGroup
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            <FormControlLabel
              value="CARD"
              control={<Radio />}
              label="Банковская карта"
            />
            <FormControlLabel
              value="CASH"
              control={<Radio />}
              label="Наличными курьеру"
            />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: "center" }}>
        <Button onClick={onClose} color="inherit">
          Отмена
        </Button>
        <Button
          onClick={handlePay}
          variant="contained"
          disabled={loading}
          sx={{ px: 4 }}
        >
          {loading ? "Обработка..." : "Оплатить"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentDialog;
