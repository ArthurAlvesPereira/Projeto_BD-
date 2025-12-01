import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
} from "@mui/material";
import { useAuthStore } from "../store/useAuthStore";
import { useFesta } from "../hooks/useFesta";
import { useQuestao } from "../hooks/useQuestao";
import type { NovaFesta } from "../types/festa";

const TIPOS_FESTA = ["Open Bar", "Venda de Bebidas", "Open Cooler", "Mista"];

export default function NovaFestaPage() {
  const navigate = useNavigate();
  const { atletica } = useAuthStore();
  const { criar, loading, error } = useFesta();
  const { questoes, listarTodas } = useQuestao();

  const [formData, setFormData] = useState<NovaFesta>({
    nome: "",
    horario: "",
    tipoFesta: "",
    local: "",
    questoesIds: [],
  });

  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    listarTodas();
  }, [listarTodas]);

  const handleChange = (field: keyof NovaFesta, value: string | number[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuestaoToggle = (id: number) => {
    setFormData((prev) => {
      const currentIds = prev.questoesIds || [];
      if (currentIds.includes(id)) {
        return { ...prev, questoesIds: currentIds.filter((qId) => qId !== id) };
      } else {
        return { ...prev, questoesIds: [...currentIds, id] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!atletica) return;

    const success = await criar(formData, atletica.cnpj);

    if (success) {
      setSucesso(true);
      setTimeout(() => {
        navigate("/festas");
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

          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            Selecionar Perguntas para Avaliação
          </Typography>
          
          <FormGroup>
            {questoes.map((q) => (
              <FormControlLabel
                key={q.idQuestao}
                control={
                  <Checkbox
                    checked={formData.questoesIds?.includes(q.idQuestao)}
                    onChange={() => handleQuestaoToggle(q.idQuestao)}
                  />
                }
                label={`${q.enunciado} (${q.tipo})`}
              />
            ))}
            {questoes.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                Nenhuma questão cadastrada. Vá em Admin &gt; Questões para adicionar.
              </Typography>
            )}
          </FormGroup>

          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate("/festas")}
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
