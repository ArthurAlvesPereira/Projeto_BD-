import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CelebrationIcon from "@mui/icons-material/Celebration";
import AssessmentIcon from "@mui/icons-material/Assessment";
import RateReviewIcon from "@mui/icons-material/RateReview";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const DRAWER_WIDTH = 240;

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAluno, isAtletica } = useAuthStore();

  const alunoMenuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "Festas", icon: <CelebrationIcon />, path: "/festas" },
    // {
    //   text: "Minhas Avaliações",
    //   icon: <RateReviewIcon />,
    //   path: "/minhas-avaliacoes",
    // },
  ];

  const atleticaMenuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    // {
    //   text: "Minhas Festas",
    //   icon: <CelebrationIcon />,
    //   path: "/minhas-festas",
    // },
    { text: "Nova Festa", icon: <AddCircleIcon />, path: "/nova-festa" },
    { text: "Relatórios", icon: <AssessmentIcon />, path: "/relatorios" },
  ];

  const menuItems = isAluno()
    ? alunoMenuItems
    : isAtletica()
    ? atleticaMenuItems
    : [];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
