import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#BE6E46", // Рыжий (кнопки, цены, хедер)
      contrastText: "#ffffff", // Текст на рыжих кнопках - белый
    },
    secondary: {
      main: "#A3BFA8", // Шалфейный зеленый (для второстепенных кнопок)
      contrastText: "#59594A",
    },
    text: {
      primary: "#59594A", // Темно-оливковый (вместо черного текста)
      secondary: "#7286A0", // Серо-голубой (для описаний)
    },
    background: {
      default: "#F9FBF6", // Очень светлый оттенок зеленого для общего фона
      paper: "#FFFFFF", // Карточки - белые
    },
    // Дополнительные цвета
    custom: {
      lightGreen: "#CDE7B0",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      color: "#59594A", // Заголовки - темный цвет
    },
    h6: {
      fontWeight: 600,
      color: "#59594A",
    },
    button: {
      fontWeight: 600, // Кнопки чуть жирнее
      textTransform: "none", // Убран капс-лок с кнопок
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          // Полоса прокрутки будет показываться всегда
          overflowY: "scroll",
        },
      },
    },
    // Настройка скругления углов для всех карточек и кнопок
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Округлые рамки
          boxShadow: "none", // Нет теней
          "&:hover": {
            boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.2)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Карточки округлые
          border: "1px solid #E0E0E0", // Тонкая рамка
          boxShadow: "0px 4px 12px rgba(0,0,0,0.05)", // Мягкая тень
        },
      },
    },
    // Теги кухни - светло-зеленый
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: "#CDE7B0", // Светло-зеленый фон
          color: "#59594A", // Темный текст
          fontWeight: 500,
        },
        outlined: {
          borderColor: "#A3BFA8",
          backgroundColor: "transparent",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#59594A", // Хедер будет темным
          boxShadow: "none",
        },
      },
    },
  },
});

export default theme;
