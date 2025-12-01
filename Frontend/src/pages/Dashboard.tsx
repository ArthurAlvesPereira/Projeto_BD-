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

      <Grid container spacing={3}>
        {isAluno() && aluno && (
          <>
            <Grid>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Bem-vindo, {aluno.nome}!
                </Typography>
                <Typography>Matrícula: {aluno.matricula}</Typography>
                <Typography>Email: {aluno.email}</Typography>
                <Typography>Curso: {aluno.codigoCurso_FK}</Typography>
              </Paper>
            </Grid>

            <Grid>
              <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
                Festas Disponíveis
              </Typography>
            </Grid>

            {loading ? (
              <Grid>
                <Typography>Carregando festas...</Typography>
              </Grid>
            ) : festas.length === 0 ? (
              <Grid>
                <Paper sx={{ p: 3, textAlign: "center" }}>
                  <Typography color="text.secondary">
                    Nenhuma festa disponível no momento
                  </Typography>
                </Paper>
              </Grid>
            ) : (
              festas.map((festa) => (
                <Grid key={festa.id}>
                  <FestaCard
                    festa={festa}
                    tipoUsuario="aluno"
                    onVerDetalhes={(id) => navigate(`/festas/${id}`)}
                    onAvaliar={(id) => navigate(`/festas/${id}/avaliar`)}
                  />
                </Grid>
              ))
            )}
          </>
        )}

        {isAtletica() && atletica && (
          <>
            <Grid>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Bem-vindo, {atletica.nome}!
                </Typography>
                <Typography>CNPJ: {atletica.cnpj}</Typography>
                <Typography>Sigla: {atletica.sigla}</Typography>
                <Typography>Mascote: {atletica.mascote}</Typography>
              </Paper>
            </Grid>

            <Grid>
              <Card>
                <CardContent>
                  <Typography variant="h6">Festas Realizadas</Typography>
                  <Typography variant="h3">{festas.length}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid>
              <Card>
                <CardContent>
                  <Typography variant="h6">Total Avaliações</Typography>
                  <Typography variant="h3">0</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid>
              <Card>
                <CardContent>
                  <Typography variant="h6">Média Geral</Typography>
                  <Typography variant="h3">-</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid>
              <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
                Minhas Festas
              </Typography>
            </Grid>

            {loading ? (
              <Grid>
                <Typography>Carregando festas...</Typography>
              </Grid>
            ) : festas.length === 0 ? (
              <Grid>
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
              </Grid>
            ) : (
              festas.map((festa) => (
                <Grid key={festa.id}>
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
              ))
            )}
          </>
        )}
      </Grid>

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
