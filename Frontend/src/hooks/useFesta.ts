import { useState } from "react";
import api from "../services/api";
import type { Festa, NovaFesta } from "../types/festa";

export const useFesta = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listarTodas = async (): Promise<Festa[]> => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/festas");
      return response.data;
    } catch (err) {
      setError("Erro ao listar festas");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const buscarPorId = async (id: number): Promise<Festa | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/festas/${id}`);
      return response.data;
    } catch (err) {
      setError("Festa não encontrada");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const buscarPorOrganizador = async (cnpj: string): Promise<Festa[]> => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/festas/organizador/${cnpj}`);
      return response.data;
    } catch (err) {
      setError("Erro ao buscar festas");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const criar = async (
    festa: NovaFesta,
    cnpjOrganizador: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await api.post("/festas", festa, {
        params: { cnpjOrganizador },
      });
      return true;
    } catch (err) {
      setError("Erro ao criar festa");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deletar = async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await api.delete(`/festas/${id}`);
      return true;
    } catch (err) {
      setError("Erro ao deletar festa");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    listarTodas,
    buscarPorId,
    buscarPorOrganizador,
    criar,
    deletar,
    loading,
    error,
  };
};
