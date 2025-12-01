import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  Chip,
  OutlinedInput,
  type SelectChangeEvent,
} from "@mui/material";
import { useFesta } from "../hooks/useFesta";
import { useQuestao } from "../hooks/useQuestao";
import type { NovaFesta } from "../types/festa";

const TIPOS_FESTA = [
  "Open Bar",
  "Venda de Bebidas",
  "Open coller",
  "Outro",
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function EditarFesta() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { buscarPorId, atualizar, loading: loadingFesta, error: errorFesta } = useFesta();
  const { questoes, listarTodas: listarQuestoes, loading: loadingQuestoes } = useQuestao(); 

  const [formData, setFormData] = useState<NovaFesta>({
    nome: "",
    horario: "",
    tipoFesta: "",
    local: "",
    questoesIds: [],
  });
  
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    listarQuestoes();
  }, []); // Load questions once

  useEffect(() => {
    const carregarFesta = async () => {
      if (!id) return;
      const festa = await buscarPorId(Number(id));
      if (festa) {
        setFormData({
          nome: festa.nome,
          horario: festa.horario, // Assuming API returns ISO string, might need formatting for input
          tipoFesta: festa.tipoFesta,
          local: festa.local,
          questoesIds: festa.questoes?.map((q) => q.idQuestao) || [],
        });
      }
      setInitialLoading(false);
    };

    carregarFesta();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      tipoFesta: e.target.value,
    }));
  };

  const handleQuestoesChange = (event: SelectChangeEvent<number[]>) => {
    const {
      target: { value },
    } = event;
    setFormData((prev) => ({
      ...prev,
      questoesIds: typeof value === "string" ? [] : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const sucesso = await atualizar(Number(id), formData);

    if (sucesso) {
      navigate("/festas");
    }
  };

  if (initialLoading || loadingFesta || loadingQuestoes) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box maxWidth="md" margin="auto">
      <Typography variant="h4" gutterBottom>
        Editar Festa
      </Typography>

      {errorFesta && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorFesta}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={3}>
            <TextField
              fullWidth
              label="Nome da Festa"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />

            <TextField
              label="Data e Horário"
              type="datetime-local"
              name="horario"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              value={formData.horario}
              onChange={handleChange}
            />

            <TextField
              select
              fullWidth
              label="Tipo de Festa"
              name="tipoFesta"
              value={formData.tipoFesta}
              onChange={handleSelectChange}
              required
            >
              {TIPOS_FESTA.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Local"
              name="local"
              value={formData.local}
              onChange={handleChange}
              required
            />

            <FormControl fullWidth>
              <InputLabel>Questões da Avaliação</InputLabel>
              <Select
                multiple
                value={formData.questoesIds || []}
                onChange={handleQuestoesChange}
                input={<OutlinedInput label="Questões da Avaliação" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => {
                      const questao = questoes.find(
                        (q) => q.idQuestao === value
                      );
                      return (
                        <Chip
                          key={value}
                          label={questao?.enunciado || value}
                        />
                      );
                    })}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {questoes.map((questao) => (
                  <MenuItem
                    key={questao.idQuestao}
                    value={questao.idQuestao}
                  >
                    {questao.enunciado} ({questao.tipo})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button variant="outlined" onClick={() => navigate("/festas")}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Salvar Alterações
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
