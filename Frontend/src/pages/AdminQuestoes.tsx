import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useQuestao } from "../hooks/useQuestao";
import type { TipoQuestao } from "../types/questao";

export default function AdminQuestoes() {
  const { questoes, loading, listarTodas, criar, excluir } = useQuestao();
  
  const [novaQuestao, setNovaQuestao] = useState({
    enunciado: "",
    tipo: "NOTA" as TipoQuestao,
  });
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    listarTodas();
  }, [listarTodas]);

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    const sucesso = await criar(novaQuestao);
    if (sucesso) {
      setMsg({ type: "success", text: "Questão criada com sucesso!" });
      setNovaQuestao({ enunciado: "", tipo: "NOTA" });
      listarTodas();
    } else {
      setMsg({ type: "error", text: "Erro ao criar questão." });
    }
  };

  const handleExcluir = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta questão?")) {
      const sucesso = await excluir(id);
      if (sucesso) {
        listarTodas();
      } else {
        alert("Erro ao excluir questão.");
      }
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gerenciar Questões
      </Typography>

      <Paper sx={{ p: 3, mb: 4, maxWidth: 800 }}>
        <Typography variant="h6" gutterBottom>
          Nova Questão
        </Typography>
        
        {msg && (
          <Alert severity={msg.type} sx={{ mb: 2 }}>
            {msg.text}
          </Alert>
        )}

        <form onSubmit={handleSalvar}>
          <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
            <TextField
              label="Enunciado"
              fullWidth
              required
              value={novaQuestao.enunciado}
              onChange={(e) =>
                setNovaQuestao({ ...novaQuestao, enunciado: e.target.value })
              }
            />
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Tipo</InputLabel>
              <Select
                value={novaQuestao.tipo}
                label="Tipo"
                onChange={(e) =>
                  setNovaQuestao({ ...novaQuestao, tipo: e.target.value as TipoQuestao })
                }
              >
                <MenuItem value="NOTA">Nota (1-10)</MenuItem>
                <MenuItem value="TEXTO">Texto Livre</MenuItem>
                <MenuItem value="MULTIPLA_ESCOLHA">Múltipla Escolha</MenuItem>
              </Select>
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              sx={{ height: 56 }}
              disabled={loading}
            >
              Adicionar
            </Button>
          </Box>
        </form>
      </Paper>

      <TableContainer component={Paper} sx={{ maxWidth: 800 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Enunciado</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questoes.map((q) => (
              <TableRow key={q.idQuestao}>
                <TableCell>{q.idQuestao}</TableCell>
                <TableCell>{q.enunciado}</TableCell>
                <TableCell>{q.tipo}</TableCell>
                <TableCell align="right">
                  <IconButton color="error" onClick={() => handleExcluir(q.idQuestao)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {questoes.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Nenhuma questão cadastrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
