import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Badge,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Divider,
  ListItemIcon,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { clearCart } from "../redux/cartSlice";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import Logout from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

const Navbar = () => {
  const { fullName, email, role } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleLogout = () => {
    handleCloseUserMenu();
    dispatch(clearCart());
    dispatch(logout());
    navigate("/login");
  };

  const getAvatarLetter = () => {
    if (fullName) return fullName.charAt(0).toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return "?";
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}
    >
      <Toolbar>
        <RestaurantIcon
          sx={{ display: { xs: "none", md: "flex" }, mr: 1, color: "#CDE7B0" }}
        />
        <Typography
          variant="h6"
          noWrap
          component={Link}
          to={"/restaurants"}
          sx={{
            mr: 2,
            display: { xs: "none", md: "flex" },
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: ".1rem",
            color: "#F9FBF6",
            textDecoration: "none",
            flexGrow: 1,
          }}
        >
          FOOD DELIVERY
        </Typography>

        <Box
          sx={{ flexGrow: 0, display: "flex", alignItems: "center", gap: 2 }}
        >
          {email ? (
            <>
              {role === "ROLE_ADMIN" && (
                <>
                  <Button
                    startIcon={<AdminPanelSettingsIcon />}
                    component={Link}
                    to="/admin/orders"
                    sx={{ color: "white", display: { xs: "none", sm: "flex" } }}
                  >
                    Заказы
                  </Button>

                  <Button
                    startIcon={<RestaurantIcon />}
                    component={Link}
                    to="/admin/restaurants"
                    sx={{ color: "white", display: { xs: "none", sm: "flex" } }}
                  >
                    Рестораны
                  </Button>
                </>
              )}

              <IconButton
                component={Link}
                to="/cart"
                size="large"
                sx={{ color: "white" }}
              >
                <Badge badgeContent={cartItems.length} color="primary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>

              <Tooltip title="Профиль">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 1 }}>
                  <Avatar sx={{ bgcolor: "#BE6E46", fontWeight: "bold" }}>
                    {getAvatarLetter()}
                  </Avatar>
                </IconButton>
              </Tooltip>

              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                keepMounted
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    minWidth: 200,
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "bold", color: "#59594A" }}
                  >
                    {fullName || "Пользователь"}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#7286A0" }}>
                    {email}
                  </Typography>
                </Box>

                <MenuItem
                  onClick={() => {
                    handleCloseUserMenu();
                    navigate("/orders");
                  }}
                >
                  <ListItemIcon>
                    <ReceiptLongIcon fontSize="small" />
                  </ListItemIcon>
                  Мои заказы
                </MenuItem>

                <Divider />

                <MenuItem
                  onClick={() => {
                    handleCloseUserMenu();
                    navigate("/profile");
                  }}
                >
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  Профиль
                </MenuItem>

                <Divider />

                <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
                  <ListItemIcon>
                    <Logout fontSize="small" color="error" />
                  </ListItemIcon>
                  Выйти
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              color="inherit"
              component={Link}
              to="/login"
              variant="outlined"
              sx={{ color: "white", borderColor: "white" }}
            >
              Войти
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
