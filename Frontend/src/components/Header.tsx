import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import LogoutIcon from "@mui/icons-material/Logout";

export default function Header() {
  const navigate = useNavigate();
  const { userType, aluno, atletica, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getUserName = () => {
    if (userType === "aluno" && aluno) return aluno.nome;
    if (userType === "atletica" && atletica) return atletica.nome;
    return "";
  };

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Sistema de Avaliações
        </Typography>

        {userType && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body1">
              {getUserName()} ({userType === "aluno" ? "Aluno" : "Atlética"})
            </Typography>
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Sair
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
