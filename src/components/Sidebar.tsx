// src/components/Sidebar.tsx
import {
  Box,
  Divider,
  IconButton,
  Paper,
  Tooltip,
} from "@mui/material";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import BuildRoundedIcon from "@mui/icons-material/BuildRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // 👈 import auth

import brandLogo from "/assets/logo1.png";

export const TOP_H = 54;
export const RAIL_W = 60;
const BRAND_GREEN = "#78B83B";

type RailItemProps = {
  title: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
};

const RailItem = ({ title, icon, active, onClick }: RailItemProps) => (
  <Tooltip title={title} placement="right">
    <Box
      onClick={onClick}
      role="button"
      tabIndex={0}
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 44,
        width: "100%",
        cursor: "pointer",
        "&:hover": { bgcolor: "action.hover", borderRadius: 0 },
        ...(active && { bgcolor: "action.selected", borderRadius: 0 }),
      }}
    >
      <Box
        sx={{
          position: "absolute",
          left: 0,
          width: 3,
          height: 24,
          bgcolor: active ? BRAND_GREEN : "transparent",
          borderRadius: 0,
        }}
      />
      <IconButton
        size="small"
        disableRipple
        disableFocusRipple
        sx={{
          p: 0.5,
          borderRadius: 0,
          bgcolor: "transparent",
          "&:hover": { bgcolor: "transparent" },
          color: active ? BRAND_GREEN : "inherit",
        }}
      >
        {icon}
      </IconButton>
    </Box>
  </Tooltip>
);

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { logout } = useAuth(); // 👈 from AuthProvider (calls Amplify signOut)

  const handleLogout = async () => {
    try {
      // Sign out from Cognito (clears tokens/session)
      await logout();

      // Optional: clear any app-specific cache if you add it later
      localStorage.removeItem("accessToken");
      localStorage.removeItem("idToken");

      // Go to login; replace so "Back" doesn't return to app
      navigate("/login", { replace: true });
    } catch {
      // Even if signOut throws (rare), force navigation away
      navigate("/login", { replace: true });
    }
  };

  return (
    <Paper
      elevation={0}
      square
      sx={{
        borderRadius: 0,
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        width: RAIL_W,
        borderRight: (t) => `1px solid ${t.palette.divider}`,
        bgcolor: "background.paper",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        zIndex: (t) => t.zIndex.appBar + 2,
        overflow: "hidden",
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          height: TOP_H,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Box
          component="img"
          // src="/src/assets/logo1.png"
          src={brandLogo} 
          alt="ToolTrail"
          sx={{ width: 40, height: 40, objectFit: "cover" }}
        />
      </Box>

      <Box sx={{ width: 30, height: 1.5, bgcolor: "divider", borderRadius: 1, mb: 3 }} />

      {/* Main nav */}
      <Box sx={{ width: "100%" }}>
        <RailItem
          title="Dashboard"
          icon={<DashboardRoundedIcon />}
          active={pathname === "/dashboard"}
          onClick={() => navigate("/dashboard")}
        />
        <RailItem
          title="Tools"
          icon={<BuildRoundedIcon />}
          active={pathname === "/tools"}
          onClick={() => navigate("/tools")}
        />
        <RailItem
          title="Logs"
          icon={<ReceiptLongRoundedIcon />}
          active={pathname === "/logs"}
          onClick={() => navigate("/logs")}
        />
      </Box>

      <Box sx={{ flexGrow: 1 }} />

      {/* Logout */}
      <Divider sx={{ width: "70%", mb: 0.5 }} />
      <Tooltip title="Logout" placement="right">
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center", mb: 1 }}>
          <IconButton size="small" onClick={handleLogout} aria-label="logout">
            <LogoutRoundedIcon sx={{ color: "#F5C000" }} />
          </IconButton>
        </Box>
      </Tooltip>
    </Paper>
  );
}
