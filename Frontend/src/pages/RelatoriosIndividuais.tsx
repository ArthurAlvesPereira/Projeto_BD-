import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Chip,
  Divider,
} from "@mui/material";
import { TrendingUp, EmojiEvents, Assessment, Star } from "@mui/icons-material";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { useAuthStore } from "../store/useAuthStore";
import { useFesta } from "../hooks/useFesta";
import { useRelatorio } from "../hooks/useRelatorio";
import type { Festa } from "../types/festa";
import type { EstatisticasFesta, RankingFesta } from "../types/relatorio";

export default function RelatoriosIndividuais() {
  const { atletica, isAtletica } = useAuthStore();
  const { buscarPorOrganizador } = useFesta();
  const { obterEstatisticasFesta, obterRankingFestas } = useRelatorio();
  const [minhasFestas, setMinhasFestas] = useState<Festa[]>([]);
  const [estatisticasFestas, setEstatisticasFestas] = useState<
    Map<number, EstatisticasFesta>
  >(new Map());
  const [rankingGeral, setRankingGeral] = useState<RankingFesta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAtletica() || !atletica) return;

    const carregarDados = async () => {
      try {
        setLoading(true);

        // Buscar festas da atlética
        const festas = await buscarPorOrganizador(atletica.cnpj);
        setMinhasFestas(festas);

        // Buscar estatísticas de cada festa
        const estatisticas = new Map<number, EstatisticasFesta>();
        for (const festa of festas) {
          try {
            const stats = await obterEstatisticasFesta(festa.id);
            if (stats) {
              estatisticas.set(festa.id, stats);
            }
          } catch (error) {
            console.error(
              `Erro ao carregar estatísticas da festa ${festa.id}:`,
              error
            );
          }
        }
        setEstatisticasFestas(estatisticas);

        // Buscar ranking geral para comparação
        try {
          const ranking = await obterRankingFestas(10);
          setRankingGeral(ranking);
        } catch (error) {
          console.error("Erro ao carregar ranking geral:", error);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [atletica]);

  if (!isAtletica()) {
    return (
      <Box>
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography color="text.secondary">
            Esta página é restrita para atléticas
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  const obterTotalAvaliacoes = (stat: EstatisticasFesta) => {
    return stat.totalAvaliacoes || stat.totalavaliacoes || 0;
  };

  const obterMediaGeral = (stat: EstatisticasFesta) => {
    return stat.mediaGeral || stat.mediageral || 0;
  };

  const obterMediaOrganizacao = (stat: EstatisticasFesta) => {
    return stat.mediaPorCategoria?.organizacao || stat.mediaorganizacao || 0;
  };

  const obterMediaDiversao = (stat: EstatisticasFesta) => {
    return stat.mediaPorCategoria?.diversao || stat.mediadjs || 0;
  };

  const obterMediaPreco = (stat: EstatisticasFesta) => {
    return stat.mediaPorCategoria?.preco || stat.mediabebidas || 0;
  };

  const obterMediaLocalizacao = (stat: EstatisticasFesta) => {
    return stat.mediaPorCategoria?.localizacao || stat.medialocal || 0;
  };

  const obterMediaSeguranca = (stat: EstatisticasFesta) => {
    return stat.mediaPorCategoria?.seguranca || stat.mediabanheiros || 0;
  };

  const calcularMediaGeral = () => {
    const avaliacoes = Array.from(estatisticasFestas.values());
    if (avaliacoes.length === 0) return 0;
    const soma = avaliacoes.reduce(
      (acc, stat) => acc + obterMediaGeral(stat) * obterTotalAvaliacoes(stat),
      0
    );
    const total = avaliacoes.reduce(
      (acc, stat) => acc + obterTotalAvaliacoes(stat),
      0
    );
    return total > 0 ? (soma / total).toFixed(2) : "0.00";
  };

  const calcularTotalAvaliacoes = () => {
    return Array.from(estatisticasFestas.values()).reduce(
      (acc, stat) => acc + obterTotalAvaliacoes(stat),
      0
    );
  };

  const minhasFestasMelhorAvaliadas = minhasFestas
    .map((festa) => ({
      ...festa,
      stats: estatisticasFestas.get(festa.id),
    }))
    .filter((f) => f.stats && obterTotalAvaliacoes(f.stats!) > 0)
    .sort((a, b) => {
      const mediaA = a.stats ? obterMediaGeral(a.stats) : 0;
      const mediaB = b.stats ? obterMediaGeral(b.stats) : 0;
      return mediaB - mediaA;
    })
    .slice(0, 5);

  const minhaPosicaoNoRanking = rankingGeral.findIndex(
    (f) => f.organizadorNome === atletica?.nome
  );

  // Preparar dados para o gráfico de evolução temporal
  const dadosEvolucao = minhasFestas
    .map((festa) => ({
      data: new Date(festa.horario),
      nome: festa.nome,
      media: estatisticasFestas.get(festa.id)
        ? obterMediaGeral(estatisticasFestas.get(festa.id)!)
        : 0,
    }))
    .filter((d) => d.media > 0)
    .sort((a, b) => a.data.getTime() - b.data.getTime());

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Relatórios - {atletica?.nome}
      </Typography>

      {/* Cards de Resumo */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <EmojiEvents color="primary" fontSize="large" />
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Festas Realizadas
                  </Typography>
                  <Typography variant="h4">{minhasFestas.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Assessment color="success" fontSize="large" />
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Total de Avaliações
                  </Typography>
                  <Typography variant="h4">
                    {calcularTotalAvaliacoes()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Star color="warning" fontSize="large" />
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Média Geral
                  </Typography>
                  <Typography variant="h4">{calcularMediaGeral()}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <TrendingUp color="info" fontSize="large" />
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Posição no Ranking
                  </Typography>
                  <Typography variant="h4">
                    {minhaPosicaoNoRanking >= 0
                      ? `#${minhaPosicaoNoRanking + 1}`
                      : "-"}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gráfico de Evolução Temporal */}
      {dadosEvolucao.length > 1 && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            <TrendingUp sx={{ verticalAlign: "middle", mr: 1 }} />
            Evolução Temporal das Avaliações
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box height={300} width="100%">
            <LineChart
              xAxis={[
                {
                  data: dadosEvolucao.map((d) => d.data),
                  scaleType: "time",
                  valueFormatter: (date) =>
                    date.toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                    }),
                },
              ]}
              series={[
                {
                  data: dadosEvolucao.map((d) => d.media),
                  label: "Média Geral",
                  color: "#1976d2",
                },
              ]}
              height={300}
            />
          </Box>
        </Paper>
      )}

      {/* Minhas Festas Melhor Avaliadas */}
      {minhasFestasMelhorAvaliadas.length > 0 && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            <Star sx={{ verticalAlign: "middle", mr: 1 }} />
            Minhas Festas Melhor Avaliadas
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Posição</TableCell>
                  <TableCell>Festa</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell align="center">Avaliações</TableCell>
                  <TableCell align="center">Média</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {minhasFestasMelhorAvaliadas.map((festa, index) => (
                  <TableRow key={festa.id}>
                    <TableCell>
                      <Chip
                        label={`#${index + 1}`}
                        color={index === 0 ? "primary" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{festa.nome}</TableCell>
                    <TableCell>
                      {new Date(festa.horario).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell align="center">
                      {obterTotalAvaliacoes(festa.stats!)}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={obterMediaGeral(festa.stats!).toFixed(2)}
                        color="success"
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Estatísticas Detalhadas por Festa */}
      {minhasFestas.length > 0 ? (
        <Grid container spacing={3}>
          {minhasFestas.map((festa) => {
            const stats = estatisticasFestas.get(festa.id);
            if (!stats || obterTotalAvaliacoes(stats) === 0) return null;

            return (
              <Grid size={{ xs: 12 }} key={festa.id}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    {festa.nome}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {new Date(festa.horario).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    - {festa.local}
                  </Typography>
                  <Divider sx={{ my: 2 }} />

                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Avaliações por Categoria
                      </Typography>
                      <Box height={250} width="100%">
                        <BarChart
                          layout="horizontal"
                          dataset={[
                            {
                              cat: "Organização",
                              val: obterMediaOrganizacao(stats),
                            },
                            {
                              cat: "DJs/Diversão",
                              val: obterMediaDiversao(stats),
                            },
                            {
                              cat: "Bebidas/Preço",
                              val: obterMediaPreco(stats),
                            },
                            {
                              cat: "Localização",
                              val: obterMediaLocalizacao(stats),
                            },
                            {
                              cat: "Segurança",
                              val: obterMediaSeguranca(stats),
                            },
                          ]}
                          yAxis={[
                            { scaleType: "band", dataKey: "cat", reverse: true },
                          ]}
                          series={[{ dataKey: "val", color: "#1976d2" }]}
                          xAxis={[{ min: 0, max: 10 }]}
                          height={250}
                          margin={{ left: 100 }}
                        />
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Participação por Curso
                      </Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Curso</TableCell>
                              <TableCell align="right">Avaliações</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {stats.distribuicaoCursos &&
                            stats.distribuicaoCursos.length > 0 ? (
                              [...stats.distribuicaoCursos]
                                .sort((a, b) => b.quantidade - a.quantidade)
                                .slice(0, 5)
                                .map((curso) => (
                                  <TableRow key={`${festa.id}-${curso.curso}`}>
                                    <TableCell>{curso.curso}</TableCell>
                                    <TableCell align="right">
                                      {curso.quantidade}
                                    </TableCell>
                                  </TableRow>
                                ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={2} align="center">
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Sem dados de distribuição por curso
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </Grid>

                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      bgcolor: "primary.light",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      Média Geral: {obterMediaGeral(stats).toFixed(2)} ⭐ |
                      Total de Avaliações: {obterTotalAvaliacoes(stats)}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography color="text.secondary">
            Você ainda não possui festas cadastradas
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
