import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  content,
  confirmText = "Подтвердить",
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { borderRadius: 3, p: 1, minWidth: 300 },
      }}
    >
      <DialogTitle sx={{ fontWeight: "bold", color: "#59594A" }}>
        {title}
      </DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ color: "text.secondary" }}>
          {content}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit" sx={{ color: "#7286A0" }}>
          Отмена
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          autoFocus
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
