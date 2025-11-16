import { Box, Toolbar } from "@mui/material";
import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function Layout() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Header />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
