import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Rating,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useAvaliacao } from "../hooks/useAvaliacao";
import { useFesta } from "../hooks/useFesta";
import { useAuthStore } from "../store/useAuthStore";
import type { NovaAvaliacao } from "../types/avaliacao";
import type { Festa } from "../types/festa";

export default function AvaliarFesta() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { aluno } = useAuthStore();
  const { criar, loading: loadingAvaliacao } = useAvaliacao();
  const { buscarPorId, loading: loadingFesta } = useFesta();

  const [erro, setErro] = useState<string | null>(null);
  const [festa, setFesta] = useState<Festa | null>(null);
  const [avaliacao, setAvaliacao] = useState<NovaAvaliacao>({
    notaDJs: 0,
    notaBebidas: 0,
    notaBanheiros: 0,
    notaLocal: 0,
    notaOrganizacao: 0,
    comentario: "",
  });

  useEffect(() => {
    const carregarFesta = async () => {
      if (id) {
        const festaData = await buscarPorId(Number.parseInt(id));
        setFesta(festaData);

        if (festaData && new Date(festaData.horario) > new Date()) {
          setErro(
            "Esta festa ainda não ocorreu. Você só pode avaliar festas que já aconteceram."
          );
        }
      }
    };

    carregarFesta();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (!aluno || !id || !festa) return;

    if (new Date(festa.horario) > new Date()) {
      setErro(
        "Esta festa ainda não ocorreu. Você só pode avaliar festas que já aconteceram."
      );
      return;
    }

    const success = await criar(
      avaliacao,
      Number.parseInt(id),
      aluno.matricula
    );

    if (success) {
      navigate("/festas");
    } else {
      setErro("Você já avaliou esta festa. Não é possível avaliar novamente.");
    }
  };

  if (loadingFesta) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Avaliar Festa
      </Typography>

      {erro && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {erro}
        </Alert>
      )}

      <Paper sx={{ p: 3, maxWidth: 600 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Box>
              <Typography component="legend">DJs</Typography>
              <Rating
                value={avaliacao.notaDJs}
                onChange={(_, value) =>
                  setAvaliacao({ ...avaliacao, notaDJs: value || 0 })
                }
                size="large"
              />
            </Box>

            <Box>
              <Typography component="legend">Bebidas</Typography>
              <Rating
                value={avaliacao.notaBebidas}
                onChange={(_, value) =>
                  setAvaliacao({ ...avaliacao, notaBebidas: value || 0 })
                }
                size="large"
              />
            </Box>

            <Box>
              <Typography component="legend">Banheiros</Typography>
              <Rating
                value={avaliacao.notaBanheiros}
                onChange={(_, value) =>
                  setAvaliacao({ ...avaliacao, notaBanheiros: value || 0 })
                }
                size="large"
              />
            </Box>

            <Box>
              <Typography component="legend">Local</Typography>
              <Rating
                value={avaliacao.notaLocal}
                onChange={(_, value) =>
                  setAvaliacao({ ...avaliacao, notaLocal: value || 0 })
                }
                size="large"
              />
            </Box>

            <Box>
              <Typography component="legend">Organização</Typography>
              <Rating
                value={avaliacao.notaOrganizacao}
                onChange={(_, value) =>
                  setAvaliacao({ ...avaliacao, notaOrganizacao: value || 0 })
                }
                size="large"
              />
            </Box>

            <TextField
              label="Comentário"
              multiline
              rows={4}
              value={avaliacao.comentario}
              onChange={(e) =>
                setAvaliacao({ ...avaliacao, comentario: e.target.value })
              }
              fullWidth
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loadingAvaliacao || !!erro}
                fullWidth
              >
                {loadingAvaliacao ? "Enviando..." : "Enviar Avaliação"}
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate("/festas")}
                fullWidth
              >
                Cancelar
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
