import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
} from "@mui/material";
import { useAuthStore } from "../store/useAuthStore";
import { useFesta } from "../hooks/useFesta";
import type { NovaFesta } from "../types/festa";

const TIPOS_FESTA = [
  "Open Bar",
  "Temática",
  "Sertanejo",
  "Eletrônica",
  "Pagode",
  "Rock",
  "Outro",
];

export default function NovaFestaPage() {
  const navigate = useNavigate();
  const { atletica } = useAuthStore();
  const { criar, loading, error } = useFesta();

  const [formData, setFormData] = useState<NovaFesta>({
    nome: "",
    horario: "",
    tipoFesta: "",
    local: "",
  });

  const [sucesso, setSucesso] = useState(false);

  const handleChange = (field: keyof NovaFesta, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!atletica) return;

    const success = await criar(formData, atletica.cnpj);

    if (success) {
      setSucesso(true);
      setTimeout(() => {
        navigate("/minhas-festas");
      }, 2000);
    }
  };

  const isFormValid = () => {
    return (
      formData.nome.trim() !== "" &&
      formData.horario !== "" &&
      formData.tipoFesta !== "" &&
      formData.local.trim() !== ""
    );
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Cadastrar Nova Festa
      </Typography>

      <Paper sx={{ p: 3, maxWidth: 600 }}>
        {sucesso && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Festa cadastrada com sucesso! Redirecionando...
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Nome da Festa"
            fullWidth
            required
            margin="normal"
            value={formData.nome}
            onChange={(e) => handleChange("nome", e.target.value)}
          />

          <TextField
            label="Data e Hora"
            type="datetime-local"
            fullWidth
            required
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={formData.horario}
            onChange={(e) => handleChange("horario", e.target.value)}
          />

          <TextField
            label="Tipo de Festa"
            select
            fullWidth
            required
            margin="normal"
            value={formData.tipoFesta}
            onChange={(e) => handleChange("tipoFesta", e.target.value)}
          >
            {TIPOS_FESTA.map((tipo) => (
              <MenuItem key={tipo} value={tipo}>
                {tipo}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Local"
            fullWidth
            required
            margin="normal"
            value={formData.local}
            onChange={(e) => handleChange("local", e.target.value)}
          />

          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate("/minhas-festas")}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!isFormValid() || loading}
            >
              {loading ? "Salvando..." : "Cadastrar Festa"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
