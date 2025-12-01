import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stack,
} from "@mui/material";
import { ArrowBack, Save } from "@mui/icons-material";
import { useQuestao } from "../hooks/useQuestao";
import type { TipoQuestao } from "../types/questao";

export default function NovaQuestao() {
  const navigate = useNavigate();
  const { criar, loading } = useQuestao();

  const [novaQuestao, setNovaQuestao] = useState({
    enunciado: "",
    tipo: "NOTA" as TipoQuestao,
  });

  const [msg, setMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    if (!novaQuestao.enunciado.trim()) {
      setMsg({ type: "error", text: "O enunciado é obrigatório." });
      return;
    }

    const sucesso = await criar(novaQuestao);
    if (sucesso) {
      setMsg({ type: "success", text: "Questão criada com sucesso!" });
      setTimeout(() => {
        navigate("/questoes");
      }, 1500);
    } else {
      setMsg({ type: "error", text: "Erro ao criar questão." });
    }
  };

  const handleVoltar = () => {
    navigate("/questoes");
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={handleVoltar}
        >
          Voltar
        </Button>
        <Typography variant="h4">Nova Questão</Typography>
      </Box>

      <Paper sx={{ p: 3, maxWidth: 800 }}>
        <form onSubmit={handleSalvar}>
          <Stack spacing={3}>
            {msg && <Alert severity={msg.type}>{msg.text}</Alert>}

            <TextField
              label="Enunciado"
              multiline
              rows={4}
              value={novaQuestao.enunciado}
              onChange={(e) =>
                setNovaQuestao({ ...novaQuestao, enunciado: e.target.value })
              }
              fullWidth
              required
              placeholder="Digite o enunciado da questão..."
            />

            <FormControl fullWidth required>
              <InputLabel>Tipo</InputLabel>
              <Select
                value={novaQuestao.tipo}
                label="Tipo"
                onChange={(e) =>
                  setNovaQuestao({
                    ...novaQuestao,
                    tipo: e.target.value as TipoQuestao,
                  })
                }
              >
                <MenuItem value="NOTA">Nota (0-10)</MenuItem>
                <MenuItem value="TEXTO">Texto Livre</MenuItem>
                <MenuItem value="BOOLEANO">Sim/Não</MenuItem>
              </Select>
            </FormControl>

            <Box display="flex" gap={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={handleVoltar}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<Save />}
                disabled={loading}
              >
                {loading ? "Salvando..." : "Salvar Questão"}
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
