import { Box } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar, { RAIL_W, TOP_H } from "./Sidebar";
import Navbar from "./Navbar";

function titleFromPath(path: string) {
  if (path.startsWith("/tools")) return "Tools";
  if (path.startsWith("/logs")) return "Logs";
  if (path.startsWith("/users")) return "User Profile";
  return "Dashboard";
}

export default function MainLayout() {
  const { pathname } = useLocation();
  const title = titleFromPath(pathname);

  return (
    <Box sx={{ height: "100vh", bgcolor: "background.default" }}>
      <Sidebar />
      <Navbar title={title} />
      {/* content area offset by rail + navbar */}
      <Box sx={{ pt: `${TOP_H + 12}px`, ml: `${RAIL_W}px`, px: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
