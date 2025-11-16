import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { useAluno } from "../hooks/useAluno";
import { useAtletica } from "../hooks/useAtletica";
import { useAuthStore } from "../store/useAuthStore";

export default function Login() {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [matricula, setMatricula] = useState("");
  const [cnpj, setCnpj] = useState("");

  const { login: loginAluno, loading: loadingAluno } = useAluno();
  const { login: loginAtletica, loading: loadingAtletica } = useAtletica();
  const { loginAluno: setLoginAluno, loginAtletica: setLoginAtletica } =
    useAuthStore();

  const handleLoginAluno = async () => {
    const aluno = await loginAluno(Number(matricula));
    if (aluno) {
      setLoginAluno(aluno);
      navigate("/dashboard");
    }
  };

  const handleLoginAtletica = async () => {
    const atletica = await loginAtletica(cnpj);
    if (atletica) {
      setLoginAtletica(atletica);
      navigate("/dashboard");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          Sistema de Avaliações
        </Typography>

        <Paper sx={{ width: "100%", mt: 3 }}>
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            centered
          >
            <Tab label="Aluno" />
            <Tab label="Atlética" />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {tabValue === 0 ? (
              <Box
                component="form"
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <TextField
                  label="Matrícula"
                  fullWidth
                  value={matricula}
                  onChange={(e) => setMatricula(e.target.value)}
                />
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleLoginAluno}
                  disabled={loadingAluno}
                >
                  {loadingAluno ? "Entrando..." : "Entrar como Aluno"}
                </Button>
              </Box>
            ) : (
              <Box
                component="form"
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <TextField
                  label="CNPJ"
                  fullWidth
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                />
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleLoginAtletica}
                  disabled={loadingAtletica}
                >
                  {loadingAtletica ? "Entrando..." : "Entrar como Atlética"}
                </Button>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
