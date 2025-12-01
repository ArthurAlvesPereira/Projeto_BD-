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
  Divider,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useAvaliacao } from "../hooks/useAvaliacao";
import { useFesta } from "../hooks/useFesta";
import { useAuthStore } from "../store/useAuthStore";
import type { NovaAvaliacao, Resposta } from "../types/avaliacao";
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
    comentarioGeral: "",
    respostas: [],
  });

  useEffect(() => {
    const carregarFesta = async () => {
      if (id) {
        const festaData = await buscarPorId(Number.parseInt(id));
        setFesta(festaData);

        if (festaData) {
          // Inicializar respostas vazias para cada questão
          const respostasIniciais: Resposta[] = (festaData.questoes || []).map(
            (q) => ({
              idQuestao: q.idQuestao,
              valorNumerico: 0,
              valorTexto: "",
              enunciado: q.enunciado, // Auxiliar para renderização se necessário
            })
          );
          setAvaliacao((prev) => ({ ...prev, respostas: respostasIniciais }));

          if (new Date(festaData.horario) > new Date()) {
            setErro(
              "Esta festa ainda não ocorreu. Você só pode avaliar festas que já aconteceram."
            );
          }
        }
      }
    };

    carregarFesta();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleRespostaChange = (
    idQuestao: number,
    field: "valorNumerico" | "valorTexto",
    value: number | string
  ) => {
    setAvaliacao((prev) => ({
      ...prev,
      respostas: prev.respostas.map((r) =>
        r.idQuestao === idQuestao ? { ...r, [field]: value } : r
      ),
    }));
  };

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
        Avaliar Festa: {festa?.nome}
      </Typography>

      {erro && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {erro}
        </Alert>
      )}

      <Paper sx={{ p: 3, maxWidth: 600 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {festa?.questoes?.map((questao) => {
              const resposta = avaliacao.respostas.find(
                (r) => r.idQuestao === questao.idQuestao
              );
              if (!resposta) return null;

              return (
                <Box key={questao.idQuestao}>
                  <Typography component="legend" gutterBottom>
                    {questao.enunciado}
                  </Typography>

                  {questao.tipo === "NOTA" && (
                    <Rating
                      value={resposta.valorNumerico || 0}
                      onChange={(_, value) =>
                        handleRespostaChange(
                          questao.idQuestao,
                          "valorNumerico",
                          value || 0
                        )
                      }
                      size="large"
                    />
                  )}

                  {questao.tipo === "TEXTO" && (
                    <TextField
                      multiline
                      rows={3}
                      fullWidth
                      value={resposta.valorTexto || ""}
                      onChange={(e) =>
                        handleRespostaChange(
                          questao.idQuestao,
                          "valorTexto",
                          e.target.value
                        )
                      }
                      placeholder="Sua resposta..."
                    />
                  )}

                  {questao.tipo === "MULTIPLA_ESCOLHA" && (
                    <TextField
                      fullWidth
                      value={resposta.valorTexto || ""}
                      onChange={(e) =>
                        handleRespostaChange(
                          questao.idQuestao,
                          "valorTexto",
                          e.target.value
                        )
                      }
                      placeholder="Digite sua escolha"
                    />
                  )}

                  {questao.tipo === "BOOLEANO" && (
                    <ToggleButtonGroup
                      value={resposta.valorTexto || ""}
                      exclusive
                      onChange={(_, value) => {
                        if (value !== null) {
                          handleRespostaChange(
                            questao.idQuestao,
                            "valorTexto",
                            value
                          );
                        }
                      }}
                      aria-label="resposta sim ou não"
                    >
                      <ToggleButton value="SIM" aria-label="sim">
                        Sim
                      </ToggleButton>
                      <ToggleButton value="NAO" aria-label="não">
                        Não
                      </ToggleButton>
                    </ToggleButtonGroup>
                  )}
                  <Divider sx={{ mt: 2 }} />
                </Box>
              );
            })}

            {(!festa?.questoes || festa.questoes.length === 0) && (
              <Typography color="text.secondary">
                Esta festa não possui perguntas específicas configuradas.
              </Typography>
            )}

            <TextField
              label="Comentário Geral (Opcional)"
              multiline
              rows={4}
              value={avaliacao.comentarioGeral}
              onChange={(e) =>
                setAvaliacao({ ...avaliacao, comentarioGeral: e.target.value })
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
