import { useEffect, useState } from "react";
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
  Chip,
  CircularProgress,
  Button,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useAvaliacao } from "../hooks/useAvaliacao";
import { useFesta } from "../hooks/useFesta";
import type { Avaliacao } from "../types/avaliacao";
import type { Festa } from "../types/festa";

export default function AvaliacoesFesta() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { listarPorFesta, loading: loadingAvaliacoes } = useAvaliacao();
  const { buscarPorId, loading: loadingFesta } = useFesta();

  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [festa, setFesta] = useState<Festa | null>(null);

  useEffect(() => {
    const carregarDados = async () => {
      if (id) {
        const festaData = await buscarPorId(Number.parseInt(id));
        setFesta(festaData);

        const avaliacoesData = await listarPorFesta(Number.parseInt(id));
        setAvaliacoes(avaliacoesData);
      }
    };

    carregarDados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const calcularMedia = (campo: keyof Avaliacao) => {
    if (avaliacoes.length === 0) return 0;
    const soma = avaliacoes.reduce((acc, av) => acc + (av[campo] as number), 0);
    return (soma / avaliacoes.length).toFixed(1);
  };

  const mediaGeral = () => {
    if (avaliacoes.length === 0) return 0;
    const campos: (keyof Avaliacao)[] = [
      "notaDJs",
      "notaBebidas",
      "notaBanheiros",
      "notaLocal",
      "notaOrganizacao",
    ];
    const somaMedias = campos.reduce(
      (acc, campo) => acc + Number.parseFloat(calcularMedia(campo)),
      0
    );
    return (somaMedias / campos.length).toFixed(1);
  };

  if (loadingFesta || loadingAvaliacoes) {
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
              Média Geral
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h4">{mediaGeral()}</Typography>
              <Rating
                value={Number.parseFloat(mediaGeral())}
                precision={0.1}
                readOnly
              />
            </Box>
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Médias por Categoria
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Categoria</TableCell>
                <TableCell align="center">Média</TableCell>
                <TableCell align="center">Avaliação</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>DJs</TableCell>
                <TableCell align="center">{calcularMedia("notaDJs")}</TableCell>
                <TableCell align="center">
                  <Rating
                    value={Number.parseFloat(calcularMedia("notaDJs"))}
                    precision={0.1}
                    readOnly
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Bebidas</TableCell>
                <TableCell align="center">
                  {calcularMedia("notaBebidas")}
                </TableCell>
                <TableCell align="center">
                  <Rating
                    value={Number.parseFloat(calcularMedia("notaBebidas"))}
                    precision={0.1}
                    readOnly
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Banheiros</TableCell>
                <TableCell align="center">
                  {calcularMedia("notaBanheiros")}
                </TableCell>
                <TableCell align="center">
                  <Rating
                    value={Number.parseFloat(calcularMedia("notaBanheiros"))}
                    precision={0.1}
                    readOnly
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Local</TableCell>
                <TableCell align="center">
                  {calcularMedia("notaLocal")}
                </TableCell>
                <TableCell align="center">
                  <Rating
                    value={Number.parseFloat(calcularMedia("notaLocal"))}
                    precision={0.1}
                    readOnly
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Organização</TableCell>
                <TableCell align="center">
                  {calcularMedia("notaOrganizacao")}
                </TableCell>
                <TableCell align="center">
                  <Rating
                    value={Number.parseFloat(calcularMedia("notaOrganizacao"))}
                    precision={0.1}
                    readOnly
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
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
                  <TableCell>DJs</TableCell>
                  <TableCell>Bebidas</TableCell>
                  <TableCell>Banheiros</TableCell>
                  <TableCell>Local</TableCell>
                  <TableCell>Organização</TableCell>
                  <TableCell>Média</TableCell>
                  <TableCell>Comentário</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {avaliacoes.map((avaliacao, index) => {
                  const media =
                    (avaliacao.notaDJs +
                      avaliacao.notaBebidas +
                      avaliacao.notaBanheiros +
                      avaliacao.notaLocal +
                      avaliacao.notaOrganizacao) /
                    5;

                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <Chip label={avaliacao.notaDJs} size="small" />
                      </TableCell>
                      <TableCell>
                        <Chip label={avaliacao.notaBebidas} size="small" />
                      </TableCell>
                      <TableCell>
                        <Chip label={avaliacao.notaBanheiros} size="small" />
                      </TableCell>
                      <TableCell>
                        <Chip label={avaliacao.notaLocal} size="small" />
                      </TableCell>
                      <TableCell>
                        <Chip label={avaliacao.notaOrganizacao} size="small" />
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography variant="body2">
                            {media.toFixed(1)}
                          </Typography>
                          <Rating
                            value={media}
                            precision={0.1}
                            readOnly
                            size="small"
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        {avaliacao.comentario || (
                          <Typography variant="body2" color="text.secondary">
                            Sem comentário
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}
