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
  Tabs,
  Tab,
  Divider,
} from "@mui/material";
import {
  EmojiEvents,
  School,
  BarChart,
  Category,
  TrendingUp,
  People,
} from "@mui/icons-material";
import { useRelatorio } from "../hooks/useRelatorio";
import type {
  RankingFesta,
  RankingAtletica,
  DistribuicaoCursos,
  ComparacaoCategoria,
  EstatisticaTipoFesta,
} from "../types/relatorio";

export default function RelatoriosGerais() {
  const {
    obterRankingFestas,
    obterRankingAtleticas,
    obterDistribuicaoCursos,
    obterComparacaoCategorias,
    obterEstatisticasTipoFesta,
  } = useRelatorio();

  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);

  // Estados para cada tipo de relatório
  const [rankingFestas, setRankingFestas] = useState<RankingFesta[]>([]);
  const [rankingAtleticas, setRankingAtleticas] = useState<RankingAtletica[]>(
    []
  );
  const [distribuicaoCursos, setDistribuicaoCursos] = useState<
    DistribuicaoCursos[]
  >([]);
  const [comparacaoCategorias, setComparacaoCategorias] = useState<
    ComparacaoCategoria[]
  >([]);
  const [estatisticasTipoFesta, setEstatisticasTipoFesta] = useState<
    EstatisticaTipoFesta[]
  >([]);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);

        const [festas, atleticas, cursos, categorias, tipos] =
          await Promise.all([
            obterRankingFestas(20),
            obterRankingAtleticas(),
            obterDistribuicaoCursos(),
            obterComparacaoCategorias(),
            obterEstatisticasTipoFesta(),
          ]);

        setRankingFestas(festas);
        setRankingAtleticas(atleticas);
        setDistribuicaoCursos(cursos);
        setComparacaoCategorias(categorias);
        setEstatisticasTipoFesta(tipos);
      } catch (error) {
        console.error("Erro ao carregar relatórios gerais:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Funções auxiliares para normalizar dados da API
  const obterIdFesta = (festa: RankingFesta) => festa.id || festa.id_festa || 0;
  const obterNomeFesta = (festa: RankingFesta) =>
    festa.titulo || festa.nome || "";
  const obterMediaGeral = (item: RankingFesta | RankingAtletica) =>
    item.mediaGeral || item.mediageral || 0;
  const obterTotalAvaliacoes = (
    item: RankingFesta | RankingAtletica | DistribuicaoCursos
  ) => {
    if ("totalAvaliacoes" in item || "totalavaliacoes" in item) {
      return item.totalAvaliacoes || item.totalavaliacoes || 0;
    }
    if ("quantidadeAvaliacoes" in item) {
      return item.quantidadeAvaliacoes || 0;
    }
    return 0;
  };
  const obterTotalFestas = (atletica: RankingAtletica) =>
    atletica.totalFestas || atletica.totalfestasrealizadas || 0;
  const obterNomeCurso = (curso: DistribuicaoCursos) =>
    curso.curso || curso.codigocurso || "";
  const obterMediaCategoria = (categoria: ComparacaoCategoria) =>
    categoria.mediaGeral || categoria.medianota || 0;
  const obterMelhorFesta = (categoria: ComparacaoCategoria) =>
    categoria.melhorFesta || categoria.melhorfesta || "N/A";
  const obterPiorFesta = (categoria: ComparacaoCategoria) =>
    categoria.piorFesta || categoria.piorfesta || "N/A";

  const obterTipoFesta = (tipo: EstatisticaTipoFesta) =>
    tipo.tipo || tipo.tipofesta || "N/A";
  const obterQuantidadeFestas = (tipo: EstatisticaTipoFesta) =>
    tipo.quantidadeFestas || tipo.totalfestas || 0;
  const obterMediaTipo = (tipo: EstatisticaTipoFesta) =>
    tipo.mediaGeral || tipo.mediageral || 0;
  const obterTotalAvaliacoesTipo = (tipo: EstatisticaTipoFesta) =>
    tipo.totalAvaliacoes || tipo.totalavaliacoes || 0;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

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

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Relatórios Gerais
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Visão geral de todas as festas e atléticas do sistema
      </Typography>

      <Paper sx={{ mb: 3, mt: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable">
          <Tab icon={<EmojiEvents />} label="Ranking de Festas" />
          <Tab icon={<People />} label="Ranking de Atléticas" />
          <Tab icon={<School />} label="Distribuição por Curso" />
          <Tab icon={<BarChart />} label="Comparação de Categorias" />
          <Tab icon={<Category />} label="Tipos de Festa" />
        </Tabs>
      </Paper>

      {/* Tab 0: Ranking de Festas */}
      {tabValue === 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            <EmojiEvents sx={{ verticalAlign: "middle", mr: 1 }} />
            Top 20 Festas Melhor Avaliadas
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {rankingFestas.length === 0 ? (
            <Typography color="text.secondary" align="center">
              Nenhuma festa avaliada ainda
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Posição</TableCell>
                    <TableCell>Festa</TableCell>
                    <TableCell>Organizador</TableCell>
                    <TableCell align="center">Avaliações</TableCell>
                    <TableCell align="center">Média</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rankingFestas.map((festa, index) => (
                    <TableRow key={obterIdFesta(festa)}>
                      <TableCell>
                        <Chip
                          label={`#${index + 1}`}
                          color={
                            index === 0
                              ? "warning"
                              : index < 3
                              ? "primary"
                              : "default"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{obterNomeFesta(festa)}</TableCell>
                      <TableCell>{festa.organizadorNome || "-"}</TableCell>
                      <TableCell align="center">
                        {obterTotalAvaliacoes(festa)}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={obterMediaGeral(festa).toFixed(2)}
                          color="success"
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}

      {/* Tab 1: Ranking de Atléticas */}
      {tabValue === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            <People sx={{ verticalAlign: "middle", mr: 1 }} />
            Ranking de Atléticas
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {rankingAtleticas.length === 0 ? (
            <Typography color="text.secondary" align="center">
              Nenhuma atlética com avaliações ainda
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Posição</TableCell>
                    <TableCell>Atlética</TableCell>
                    <TableCell>Sigla</TableCell>
                    <TableCell align="center">Festas</TableCell>
                    <TableCell align="center">Avaliações</TableCell>
                    <TableCell align="center">Média Geral</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rankingAtleticas.map((atletica, index) => (
                    <TableRow key={atletica.cnpj}>
                      <TableCell>
                        <Chip
                          label={`#${index + 1}`}
                          color={
                            index === 0
                              ? "warning"
                              : index < 3
                              ? "primary"
                              : "default"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{atletica.nome}</TableCell>
                      <TableCell>{atletica.sigla}</TableCell>
                      <TableCell align="center">
                        {obterTotalFestas(atletica)}
                      </TableCell>
                      <TableCell align="center">
                        {obterTotalAvaliacoes(atletica)}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={obterMediaGeral(atletica).toFixed(2)}
                          color="success"
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}

      {/* Tab 2: Distribuição por Curso */}
      {tabValue === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            <School sx={{ verticalAlign: "middle", mr: 1 }} />
            Participação por Curso
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {distribuicaoCursos.length === 0 ? (
            <Typography color="text.secondary" align="center">
              Nenhuma avaliação registrada ainda
            </Typography>
          ) : (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 8 }}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Curso</TableCell>
                        <TableCell align="right">Avaliações</TableCell>
                        <TableCell align="right">Percentual</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {distribuicaoCursos.map((curso, index) => {
                        const total = distribuicaoCursos.reduce(
                          (acc, c) => acc + obterTotalAvaliacoes(c),
                          0
                        );
                        const avaliacoes = obterTotalAvaliacoes(curso);
                        const percentual =
                          total > 0
                            ? ((avaliacoes / total) * 100).toFixed(1)
                            : "0.0";
                        return (
                          <TableRow
                            key={obterNomeCurso(curso) || `curso-${index}`}
                          >
                            <TableCell>{obterNomeCurso(curso)}</TableCell>
                            <TableCell align="right">{avaliacoes}</TableCell>
                            <TableCell align="right">
                              <Chip label={`${percentual}%`} size="small" />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Estatísticas
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total de Cursos
                    </Typography>
                    <Typography variant="h4" gutterBottom>
                      {distribuicaoCursos.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total de Avaliações
                    </Typography>
                    <Typography variant="h4">
                      {distribuicaoCursos.reduce(
                        (acc, c) => acc + obterTotalAvaliacoes(c),
                        0
                      )}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </Paper>
      )}

      {/* Tab 3: Comparação de Categorias */}
      {tabValue === 3 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            <BarChart sx={{ verticalAlign: "middle", mr: 1 }} />
            Análise Comparativa por Categoria
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {comparacaoCategorias.length === 0 ? (
            <Typography color="text.secondary" align="center">
              Nenhuma categoria disponível
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Categoria</TableCell>
                    <TableCell align="center">Média Geral</TableCell>
                    <TableCell>Melhor Festa</TableCell>
                    <TableCell>Pior Festa</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {comparacaoCategorias.map((categoria, index) => (
                    <TableRow key={categoria.categoria || `categoria-${index}`}>
                      <TableCell>
                        <Typography fontWeight="bold">
                          {categoria.categoria}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={obterMediaCategoria(categoria).toFixed(2)}
                          color="primary"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{obterMelhorFesta(categoria)}</TableCell>
                      <TableCell>{obterPiorFesta(categoria)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}

      {/* Tab 4: Tipos de Festa */}
      {tabValue === 4 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            <Category sx={{ verticalAlign: "middle", mr: 1 }} />
            Estatísticas por Tipo de Festa
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {estatisticasTipoFesta.length === 0 ? (
            <Typography color="text.secondary" align="center">
              Nenhum tipo de festa registrado
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {estatisticasTipoFesta.map((tipo, index) => (
                <Grid
                  size={{ xs: 12, sm: 6, md: 4 }}
                  key={obterTipoFesta(tipo) || `tipo-${index}`}
                >
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {obterTipoFesta(tipo)}
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2" color="text.secondary">
                          Quantidade
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {obterQuantidadeFestas(tipo)}
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2" color="text.secondary">
                          Avaliações
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {obterTotalAvaliacoesTipo(tipo)}
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          Média Geral
                        </Typography>
                        <Chip
                          label={obterMediaTipo(tipo).toFixed(2)}
                          color="success"
                          size="small"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      )}
    </Box>
  );
}
