import { useEffect, useState } from "react";
import { restaurantApi } from "../api/axiosConfig";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  TextField,
  Pagination,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [filters, setFilters] = useState({
    name: "",
    cuisine: "",
    address: "",
  });

  const PAGE_SIZE = 9;

  const fetchRestaurants = () => {
    const params = {
      page: page - 1,
      size: PAGE_SIZE,
      ...(filters.name && { name: filters.name }),
      ...(filters.cuisine && { cuisine: filters.cuisine }),
      ...(filters.address && { address: filters.address }),
    };

    restaurantApi
      .get("/restaurants", { params })
      .then((res) => {
        if (res.data.content) {
          setRestaurants(res.data.content);
          setTotalPages(res.data.totalPages);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchRestaurants();
  }, [page]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    setPage(1);
    fetchRestaurants();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: "bold", mb: 4, textAlign: "center" }}
      >
        Рестораны
      </Typography>

      {/* Блок фильтров */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 5 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            backgroundColor: "#F9FBF6",
            border: "1px solid #E0E0E0",
            borderRadius: 4,
            width: "100%",
            maxWidth: "900px",
          }}
        >
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            {/* Поля ввода фильтров */}
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Название"
                name="name"
                value={filters.name}
                onChange={handleFilterChange}
                onKeyDown={handleKeyDown}
                size="small"
                variant="outlined"
                sx={{ bgcolor: "white" }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Кухня"
                name="cuisine"
                value={filters.cuisine}
                onChange={handleFilterChange}
                onKeyDown={handleKeyDown}
                size="small"
                variant="outlined"
                sx={{ bgcolor: "white" }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Адрес"
                name="address"
                value={filters.address}
                onChange={handleFilterChange}
                onKeyDown={handleKeyDown}
                size="small"
                variant="outlined"
                sx={{ bgcolor: "white" }}
              />
            </Grid>

            {/* Кнопка поиска */}
            <Grid item xs={12} sm={2}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSearch}
                sx={{ height: "40px", fontWeight: "bold" }}
              >
                Найти
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Список ресторанов */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 3,
        }}
      >
        {restaurants.length > 0 ? (
          restaurants.map((rest) => (
            <Card
              key={rest.id}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: 3,
                borderRadius: 3,
                transition: "0.2s",
                "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <RestaurantIcon color="primary" sx={{ mr: 1 }} />
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", lineHeight: 1.2 }}
                  >
                    {rest.name}
                  </Typography>
                </Box>

                <Chip
                  label={rest.cuisine}
                  size="small"
                  sx={{ mb: 2, bgcolor: "#CDE7B0" }}
                />

                <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                  <LocationOnIcon
                    fontSize="small"
                    color="action"
                    sx={{ mr: 0.5, mt: 0.3, flexShrink: 0 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {rest.address}
                  </Typography>
                </Box>
              </CardContent>

              <Box sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => navigate(`/menu/${rest.id}`)}
                >
                  Меню
                </Button>
              </Box>
            </Card>
          ))
        ) : (
          <Box sx={{ gridColumn: "1 / -1", textAlign: "center", py: 5 }}>
            <Typography variant="h6" color="text.secondary">
              Ничего не найдено
            </Typography>
            <Button
              variant="text"
              onClick={() => {
                setFilters({ name: "", cuisine: "", address: "" });
                setPage(1);
                window.location.reload();
              }}
            >
              Сбросить фильтры
            </Button>
          </Box>
        )}
      </Box>

      {/* Пагинация */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
            size="large"
            shape="rounded"
          />
        </Box>
      )}
    </Container>
  );
};

export default RestaurantList;
