import { useState } from "react";
import api from "../services/api";

export interface Aluno {
  matricula: number;
  nome: string;
  codigoCurso_FK: string;
}

export const useAluno = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (matricula: number): Promise<Aluno | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/alunos/${matricula}`);
      return response.data;
    } catch (err) {
      setError("Matrícula não encontrada");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const listarTodos = async (): Promise<Aluno[]> => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/alunos");
      return response.data;
    } catch (err) {
      setError("Erro ao listar alunos");
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { login, listarTodos, loading, error };
};
