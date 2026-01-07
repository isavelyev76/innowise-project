import { useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Alert,
  Tabs,
  Tab,
} from "@mui/material";

import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

import ProfileTab from "../components/profile/ProfileTab";
import SecurityTab from "../components/profile/SecurityTab";
import AddressesTab from "../components/profile/AddressesTab";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: { xs: 2, md: 4 } }}>{children}</Box>}
    </div>
  );
}

const UserProfilePage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [msg, setMsg] = useState({ type: "", text: "" });
  // Функция показа уведомлений (передается потомкам)
  const showMessage = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: "", text: "" }), 4000);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: "#59594A" }}>
          Настройки аккаунта
        </Typography>
      </Box>

      {/* Глобальное уведомление */}
      {msg.text && (
        <Alert
          severity={msg.type}
          sx={{ mb: 3 }}
          onClose={() => setMsg({ type: "", text: "" })}
        >
          {msg.text}
        </Alert>
      )}

      <Paper
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: 2,
          minHeight: 500,
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={(e, v) => setTabIndex(v)}
          variant="fullWidth"
          sx={{
            bgcolor: "#F9FBF6",
            borderBottom: "1px solid #e0e0e0",
            "& .MuiTab-root": { py: 3, fontWeight: "bold" },
          }}
          TabIndicatorProps={{
            style: { backgroundColor: "#BE6E46", height: 3 },
          }}
        >
          <Tab
            icon={<PersonOutlineIcon />}
            label="Профиль"
            iconPosition="start"
          />
          <Tab
            icon={<LockOutlinedIcon />}
            label="Безопасность"
            iconPosition="start"
          />
          <Tab
            icon={<LocationOnOutlinedIcon />}
            label="Адреса"
            iconPosition="start"
          />
        </Tabs>

        <TabPanel value={tabIndex} index={0}>
          <ProfileTab showMessage={showMessage} />
        </TabPanel>

        <TabPanel value={tabIndex} index={1}>
          <SecurityTab showMessage={showMessage} />
        </TabPanel>

        <TabPanel value={tabIndex} index={2}>
          <AddressesTab showMessage={showMessage} />
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default UserProfilePage;
