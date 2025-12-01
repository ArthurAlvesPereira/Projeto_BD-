import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useFesta } from "../hooks/useFesta";
import type { Festa } from "../types/festa";
import FestaCard from "../components/FestaCard";

export default function Dashboard() {
  const navigate = useNavigate();
  const { aluno, atletica, isAluno, isAtletica } = useAuthStore();
  const { listarTodas, buscarPorOrganizador, deletar, loading } = useFesta();
  const [festas, setFestas] = useState<Festa[]>([]);
  const [festaParaDeletar, setFestaParaDeletar] = useState<number | null>(null);

  useEffect(() => {
    const carregarFestas = async () => {
      if (isAluno()) {
        const todasFestas = await listarTodas();
        setFestas(todasFestas);
      } else if (isAtletica() && atletica) {
        const minhasFestas = await buscarPorOrganizador(atletica.cnpj);
        setFestas(minhasFestas);
      }
    };

    carregarFestas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeletarFesta = async () => {
    if (!festaParaDeletar) return;

    const success = await deletar(festaParaDeletar);

    if (success) {
      setFestas(festas.filter((f) => f.id !== festaParaDeletar));
      setFestaParaDeletar(null);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {isAluno() && aluno && (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Bem-vindo, {aluno.nome}!
                </Typography>
                <Typography>Matrícula: {aluno.matricula}</Typography>
                <Typography>Curso: {aluno.codigoCurso_FK}</Typography>
              </Paper>
            </Grid>
          </Grid>

          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Festas Disponíveis
          </Typography>

          {loading ? (
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography>Carregando festas...</Typography>
            </Paper>
          ) : festas.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography color="text.secondary">
                Nenhuma festa disponível no momento
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {festas.map((festa) => (
                <Grid key={festa.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <FestaCard
                    festa={festa}
                    tipoUsuario="aluno"
                    onVerDetalhes={(id) => navigate(`/festas/${id}`)}
                    onAvaliar={(id) => navigate(`/festas/${id}/avaliar`)}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      {isAtletica() && atletica && (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Bem-vindo, {atletica.nome}!
                </Typography>
                <Typography>CNPJ: {atletica.cnpj}</Typography>
                <Typography>Sigla: {atletica.sigla}</Typography>
                <Typography>Mascote: {atletica.mascote}</Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Festas Realizadas</Typography>
                  <Typography variant="h3">{festas.length}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Total Avaliações</Typography>
                  <Typography variant="h3">0</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Média Geral</Typography>
                  <Typography variant="h3">-</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Minhas Festas
          </Typography>

          {loading ? (
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography>Carregando festas...</Typography>
            </Paper>
          ) : festas.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography color="text.secondary" gutterBottom>
                Você ainda não cadastrou nenhuma festa
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/nova-festa")}
                sx={{ mt: 2 }}
              >
                Cadastrar Primeira Festa
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {festas.map((festa) => (
                <Grid key={festa.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <FestaCard
                    festa={festa}
                    tipoUsuario="atletica"
                    onVerAvaliacoes={(id) =>
                      navigate(`/festas/${id}/avaliacoes`)
                    }
                    onEditar={(id) => navigate(`/editar-festa/${id}`)}
                    onDeletar={(id) => setFestaParaDeletar(id)}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      <Dialog
        open={festaParaDeletar !== null}
        onClose={() => setFestaParaDeletar(null)}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja deletar esta festa? Esta ação não pode ser
            desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFestaParaDeletar(null)}>Cancelar</Button>
          <Button
            onClick={handleDeletarFesta}
            color="error"
            variant="contained"
          >
            Deletar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
