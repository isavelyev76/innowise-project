import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { restaurantApi } from "../api/axiosConfig";
import {
  Container,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import defaultImage from "../assets/image-placeholder.svg";

const RESTAURANT_URL = "http://localhost:9090";

const MenuPage = () => {
  const { id } = useParams();
  const [dishes, setDishes] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    restaurantApi
      .get(`/dishes/restaurant/${id}`)
      .then((res) => setDishes(res.data))
      .catch((err) => console.error("Ошибка загрузки меню:", err));
  }, [id]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return defaultImage;
    if (imagePath.startsWith("http")) return imagePath;
    return `${RESTAURANT_URL}${imagePath}`;
  };

  const isAuthenticated = useSelector((state) => state.auth.email);

  const handleAddToCart = (dish) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    dispatch(
      addToCart({
        id: dish.id,
        name: dish.name,
        price: dish.price,
        restaurantId: dish.restaurantId,
      })
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 5 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/restaurants")}
        sx={{ mb: 2 }}
      >
        К ресторанам
      </Button>

      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: "bold", mb: 4, textAlign: "center" }}
      >
        Меню ресторана
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 3,
        }}
      >
        {dishes.map((dish) => (
          <Card
            key={dish.id}
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              borderRadius: 3,
              boxShadow: 3,
              transition: "0.2s",
              "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
            }}
          >
            <CardMedia
              component="img"
              height="200"
              image={getImageUrl(dish.imageUrl)}
              alt={dish.name}
              sx={{ objectFit: "cover" }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultImage;
              }}
            />

            <CardContent sx={{ flexGrow: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 1,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", lineHeight: 1.2 }}
                >
                  {dish.name}
                </Typography>
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{ fontWeight: "bold", whiteSpace: "nowrap", ml: 1 }}
                >
                  {dish.price} BYN
                </Typography>
              </Box>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: "-webkit-box",
                  overflow: "hidden",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 3,
                }}
              >
                {dish.description || "Описание отсутствует"}
              </Typography>
            </CardContent>

            <Box sx={{ p: 2, pt: 0 }}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<AddShoppingCartIcon />}
                sx={{ borderRadius: 2, fontWeight: "bold", py: 1 }}
                onClick={() => handleAddToCart(dish)}
              >
                В корзину
              </Button>
            </Box>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default MenuPage;
