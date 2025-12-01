import { useState, useCallback } from "react";
import api from "../services/api";
import type { Questao } from "../types/questao";

export function useQuestao() {
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listarTodas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Questao[]>("/questoes");
      setQuestoes(response.data);
    } catch (err) {
      setError("Erro ao buscar questões.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const criar = useCallback(async (questao: Omit<Questao, "idQuestao">): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await api.post("/questoes", questao);
      return true;
    } catch (err) {
      setError("Erro ao criar questão.");
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const excluir = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/questoes/${id}`);
      return true;
    } catch (err) {
      setError("Erro ao excluir questão.");
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    questoes,
    loading,
    error,
    listarTodas,
    criar,
    excluir,
  };
}
