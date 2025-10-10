import {
  AppBar,
  Avatar,
  IconButton,
  InputAdornment,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useThemeMode } from "../theme";
import { RAIL_W, TOP_H } from "./Sidebar";
// import { useNavigate } from "react-router-dom"; 

export default function Navbar({ title }: { title: string }) {
  const { mode, toggle } = useThemeMode();
  // const navigate = useNavigate();   

  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={0}
      sx={{
        height: TOP_H,
        bgcolor: "background.paper",
        borderBottom: (t) => `1px solid ${t.palette.divider}`,
        ml: `${RAIL_W}px`,
        width: `calc(100% - ${RAIL_W}px)`,
        zIndex: (t) => t.zIndex.appBar + 1,
      }}
    >
      <Toolbar sx={{ minHeight: TOP_H, px: 2, gap: 1.5 }}>
        <Typography variant="h6" sx={{ mr: "auto", fontWeight: 700, fontSize: 18, lineHeight: 1 }}>
          {title}
        </Typography>
        <TextField
  placeholder="Search…"
  size="small"
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <SearchIcon fontSize="small" />
      </InputAdornment>
    ),
  }}
  sx={{
    width: { xs: 220, sm: 320, md: 210 }, // ↓ fixed, smaller widths (responsive)
    flex: "0 0 auto",                     // don't stretch in the navbar
    "& .MuiOutlinedInput-root": {
      borderRadius: 1,
      height: 36,
      bgcolor: "background.default",
    },
  }}
/>


        <Tooltip title={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}>
          <IconButton size="small" onClick={toggle}>
            {mode === "dark" ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
          </IconButton>
        </Tooltip>

        <Tooltip title="Profile">
          <Avatar sx={{ width: 28, height: 28 }} src="/src/assets/profile.jpg">
            Y
          </Avatar>
        </Tooltip>
      
      </Toolbar>
    </AppBar>
  );
}
