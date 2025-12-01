import { useEffect, useState } from "react";
import { Box, Typography, Grid, Tabs, Tab, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFesta } from "../hooks/useFesta";
import { useAuthStore } from "../store/useAuthStore";
import type { Festa } from "../types/festa";
import FestaCard from "../components/FestaCard";

export default function Festas() {
  const navigate = useNavigate();
  const { listarTodas, loading } = useFesta();
  const { userType } = useAuthStore();
  const [festas, setFestas] = useState<Festa[]>([]);
  const [tabValue, setTabValue] = useState(1);

  const tipoUsuario = userType === "atletica" ? "atletica" : "aluno";

  useEffect(() => {
    const carregarFestas = async () => {
      const todasFestas = await listarTodas();
      setFestas(todasFestas);
    };

    carregarFestas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const agora = new Date();

  const proximasFestas = festas
    .filter((festa) => new Date(festa.horario) >= agora)
    .sort(
      (a, b) => new Date(a.horario).getTime() - new Date(b.horario).getTime()
    );

  const festasPassadas = festas
    .filter((festa) => new Date(festa.horario) < agora)
    .sort(
      (a, b) => new Date(b.horario).getTime() - new Date(a.horario).getTime()
    );

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const festasFiltradas = tabValue === 0 ? proximasFestas : festasPassadas;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Festas
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label={`Próximas (${proximasFestas.length})`} />
          <Tab label={`Passadas (${festasPassadas.length})`} />
        </Tabs>
      </Paper>

      {loading ? (
        <Typography>Carregando festas...</Typography>
      ) : festasFiltradas.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography color="text.secondary">
            {tabValue === 0
              ? "Nenhuma festa agendada no momento"
              : "Nenhuma festa passada encontrada"}
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {festasFiltradas.map((festa) => (
            <Grid key={festa.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <FestaCard
                festa={festa}
                tipoUsuario={tipoUsuario}
                onVerDetalhes={(id) => navigate(`/festas/${id}`)}
                onAvaliar={(id) => navigate(`/festas/${id}/avaliar`)}
                onEditar={(id) => navigate(`/festas/${id}/editar`)}
                onVerAvaliacoes={(id) => navigate(`/festas/${id}/avaliacoes`)}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
