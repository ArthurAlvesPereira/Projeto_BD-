import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import { useAluno } from "../hooks/useAluno";
import { useAtletica } from "../hooks/useAtletica";
import { useCurso } from "../hooks/useCurso";
import type { Aluno } from "../types/aluno";
import type { Atletica } from "../types/atletica";
import type { Curso } from "../types/curso";

export default function Admin() {
  const { listarTodos: listarAlunos, loading: loadingAlunos } = useAluno();
  const { listarTodas: listarAtleticas, loading: loadingAtleticas } =
    useAtletica();
  const { listarTodos: listarCursos, loading: loadingCursos } = useCurso();

  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [atleticas, setAtleticas] = useState<Atletica[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);

  useEffect(() => {
    const carregarDados = async () => {
      const [alunosData, atleticasData, cursosData] = await Promise.all([
        listarAlunos(),
        listarAtleticas(),
        listarCursos(),
      ]);
      setAlunos(alunosData);
      setAtleticas(atleticasData);
      setCursos(cursosData);
    };

    carregarDados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loading = loadingAlunos || loadingAtleticas || loadingCursos;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Administração
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Atléticas */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="h5" gutterBottom>
              Atléticas ({atleticas.length})
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>CNPJ</TableCell>
                    <TableCell>Nome</TableCell>
                    <TableCell>Sigla</TableCell>
                    <TableCell>Mascote</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {atleticas.map((atletica) => (
                    <TableRow key={atletica.cnpj}>
                      <TableCell>{atletica.cnpj}</TableCell>
                      <TableCell>{atletica.nome}</TableCell>
                      <TableCell>{atletica.sigla}</TableCell>
                      <TableCell>{atletica.mascote}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* Cursos */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="h5" gutterBottom>
              Cursos ({cursos.length})
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Código</TableCell>
                    <TableCell>Nome do Curso</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cursos.map((curso) => (
                    <TableRow key={curso.codigoCurso}>
                      <TableCell>{curso.codigoCurso}</TableCell>
                      <TableCell>{curso.nomeCurso}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* Alunos */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="h5" gutterBottom>
              Alunos ({alunos.length})
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Matrícula</TableCell>
                    <TableCell>Nome</TableCell>
                    <TableCell>Curso</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {alunos.map((aluno) => (
                    <TableRow key={aluno.matricula}>
                      <TableCell>{aluno.matricula}</TableCell>
                      <TableCell>{aluno.nome}</TableCell>
                      <TableCell>{aluno.codigoCurso_FK}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
