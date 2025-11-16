import { useState } from "react";
import api from "../services/api";
import type { Avaliacao, NovaAvaliacao } from "../types/avaliacao";

export const useAvaliacao = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listarPorFesta = async (idFesta: number): Promise<Avaliacao[]> => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/avaliacoes/festa/${idFesta}`);
      return response.data;
    } catch (err) {
      setError("Erro ao listar avaliações");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const verificarAvaliacao = async (
    matricula: number,
    idFesta: number
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(
        `/avaliacoes/verificar/${matricula}/${idFesta}`
      );
      return response.data.jaAvaliou;
    } catch (err) {
      setError("Erro ao verificar avaliação");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const criar = async (
    avaliacao: NovaAvaliacao,
    idFesta: number,
    matricula: number
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await api.post("/avaliacoes", avaliacao, {
        params: { idFesta, matricula },
      });
      return true;
    } catch (err) {
      setError("Erro ao criar avaliação");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    listarPorFesta,
    verificarAvaliacao,
    criar,
    loading,
    error,
  };
};
