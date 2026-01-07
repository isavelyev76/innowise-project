import React from "react";
import { Box, Typography, Container } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        mt: "auto",
        backgroundColor: "#59594A",
        color: "#F9FBF6",
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body1" align="center" sx={{ fontWeight: "bold" }}>
          Food Delivery App
        </Typography>
        <Typography
          variant="body2"
          align="center"
          sx={{ opacity: 0.7, mt: 0.5 }}
        >
          © {new Date().getFullYear()} Вкусная еда в каждый дом. Все права
          защищены.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
