import { useState } from "react";
import api from "../services/api";

export interface Atletica {
  cnpj: string;
  nome: string;
  sigla: string;
  mascote: string;
}

export const useAtletica = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (cnpj: string): Promise<Atletica | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/atleticas/${cnpj}`);
      return response.data;
    } catch (err) {
      setError("CNPJ não encontrado");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const listarTodas = async (): Promise<Atletica[]> => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/atleticas");
      return response.data;
    } catch (err) {
      setError("Erro ao listar atléticas");
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { login, listarTodas, loading, error };
};
