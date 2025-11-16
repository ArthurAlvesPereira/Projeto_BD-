import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import type { Festa } from "../types/festa";
import CelebrationIcon from "@mui/icons-material/Celebration";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocationOnIcon from "@mui/icons-material/LocationOn";

interface FestaCardProps {
  festa: Festa;
  tipoUsuario: "aluno" | "atletica";
  onVerDetalhes?: (id: number) => void;
  onAvaliar?: (id: number) => void;
  onVerAvaliacoes?: (id: number) => void;
  onEditar?: (id: number) => void;
  onDeletar?: (id: number) => void;
}

export default function FestaCard({
  festa,
  tipoUsuario,
  onVerDetalhes,
  onAvaliar,
  onVerAvaliacoes,
  onEditar,
  onDeletar,
}: FestaCardProps) {
  const formatarData = (horario: string) => {
    const data = new Date(horario);
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <CelebrationIcon color="primary" />
          <Typography variant="h6">{festa.nome}</Typography>
        </Box>

        <Chip label={festa.tipoFesta} size="small" sx={{ mb: 2 }} />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <CalendarMonthIcon fontSize="small" color="action" />
          <Typography variant="body2">{formatarData(festa.horario)}</Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LocationOnIcon fontSize="small" color="action" />
          <Typography variant="body2">{festa.local}</Typography>
        </Box>
      </CardContent>
      <CardActions>
        {tipoUsuario === "aluno" ? (
          <>
            {onVerDetalhes && (
              <Button size="small" onClick={() => onVerDetalhes(festa.id)}>
                Ver Detalhes
              </Button>
            )}
            {onAvaliar && (
              <Button
                size="small"
                variant="contained"
                onClick={() => onAvaliar(festa.id)}
              >
                Avaliar
              </Button>
            )}
          </>
        ) : (
          <>
            {onVerAvaliacoes && (
              <Button size="small" onClick={() => onVerAvaliacoes(festa.id)}>
                Ver Avaliações
              </Button>
            )}
            {onEditar && (
              <Button
                size="small"
                variant="outlined"
                onClick={() => onEditar(festa.id)}
              >
                Editar
              </Button>
            )}
            {onDeletar && (
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={() => onDeletar(festa.id)}
              >
                Deletar
              </Button>
            )}
          </>
        )}
      </CardActions>
    </Card>
  );
}
