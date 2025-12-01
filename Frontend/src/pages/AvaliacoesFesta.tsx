import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Rating,
  CircularProgress,
  Button,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useAvaliacao } from "../hooks/useAvaliacao";
import { useFesta } from "../hooks/useFesta";
import { useQuestao } from "../hooks/useQuestao";
import type { Avaliacao } from "../types/avaliacao";
import type { Festa } from "../types/festa";
import type { Questao } from "../types/questao";

export default function AvaliacoesFesta() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { listarPorFesta, loading: loadingAvaliacoes } = useAvaliacao();
  const { buscarPorId, loading: loadingFesta } = useFesta();
  const { listarTodas, questoes, loading: loadingQuestoes } = useQuestao();

  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [festa, setFesta] = useState<Festa | null>(null);

  // Criar mapa de questões para acesso rápido
  const questoesMap = useMemo(() => {
    const map = new Map<number, Questao>();
    questoes.forEach(q => map.set(q.idQuestao || 0, q));
    return map;
  }, [questoes]);

  useEffect(() => {
    const carregarDados = async () => {
      if (id) {
        listarTodas(); // Dispara busca de questões
        
        const [festaData, avaliacoesData] = await Promise.all([
          buscarPorId(Number.parseInt(id)),
          listarPorFesta(Number.parseInt(id)),
        ]);
        
        setFesta(festaData);
        setAvaliacoes(avaliacoesData);
      }
    };

    carregarDados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const calcularMediaGeral = () => {
    if (avaliacoes.length === 0) return 0;
    
    // Coleta todas as respostas do tipo NOTA
    let somaNotas = 0;
    let quantidadeNotas = 0;

    avaliacoes.forEach(avaliacao => {
      avaliacao.respostas.forEach(resposta => {
        const questao = questoesMap.get(resposta.idQuestao);
        if (questao?.tipo === 'NOTA' && resposta.valorNumerico !== undefined) {
          somaNotas += Number(resposta.valorNumerico);
          quantidadeNotas++;
        }
      });
    });

    return quantidadeNotas > 0 ? (somaNotas / quantidadeNotas).toFixed(1) : "0.0";
  };

  if (loadingFesta || loadingAvaliacoes || loadingQuestoes) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Avaliações da Festa</Typography>
        <Button variant="outlined" onClick={() => navigate("/dashboard")}>
          Voltar
        </Button>
      </Box>

      {festa && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            {festa.nome}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {festa.tipoFesta} • {festa.local}
          </Typography>
        </Paper>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Resumo das Avaliações
        </Typography>
        <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Total de Avaliações
            </Typography>
            <Typography variant="h4">{avaliacoes.length}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Média Geral (Todas as Questões)
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h4">{calcularMediaGeral()}</Typography>
              <Rating
                value={Number.parseFloat(calcularMediaGeral() as string)}
                precision={0.1}
                readOnly
              />
            </Box>
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Todas as Avaliações ({avaliacoes.length})
        </Typography>
        {avaliacoes.length === 0 ? (
          <Typography
            color="text.secondary"
            sx={{ textAlign: "center", py: 3 }}
          >
            Esta festa ainda não possui avaliações
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Aluno (Matrícula)</TableCell>
                  <TableCell>Comentário Geral</TableCell>
                  <TableCell align="center">Respostas</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {avaliacoes.map((avaliacao, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {avaliacao.matriculaAluno}
                    </TableCell>
                    <TableCell>
                      {avaliacao.comentarioGeral || (
                        <Typography variant="body2" color="text.secondary">
                          Sem comentário
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" flexDirection="column" gap={1}>
                        {avaliacao.respostas.map((resp, idx) => {
                          const questao = questoesMap.get(resp.idQuestao);
                          return (
                            <Box key={idx} display="flex" justifyContent="space-between" alignItems="center" sx={{ borderBottom: '1px solid #eee', pb: 0.5 }}>
                               <Typography variant="caption" sx={{ fontWeight: 'bold', mr: 2 }}>
                                 {questao?.enunciado || `Questão ${resp.idQuestao}`}:
                               </Typography>
                               {questao?.tipo === 'NOTA' ? (
                                 <Rating value={Number(resp.valorNumerico)} readOnly size="small" />
                               ) : (
                                 <Typography variant="body2">{resp.valorTexto || resp.valorNumerico}</Typography>
                               )}
                            </Box>
                          );
                        })}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}
