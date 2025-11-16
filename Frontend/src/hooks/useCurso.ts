import { useState } from "react";
import api from "../services/api";
import type { Curso } from "../types/curso";

export const useCurso = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listarTodos = async (): Promise<Curso[]> => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/cursos");
      return response.data;
    } catch (err) {
      setError("Erro ao listar cursos");
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    listarTodos,
    loading,
    error,
  };
};
