import { useState } from "react";
import { relatorioService } from "../services/relatorioService";
import type {
  EstatisticasFesta,
  RankingFesta,
  RankingAtletica,
  DistribuicaoCursos,
  ComparacaoCategoria,
  EstatisticaTipoFesta,
  AlunoAtivo,
  TendenciaTemporal,
  MaiorParticipacao,
} from "../types/relatorio";

export const useRelatorio = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const obterRankingFestas = async (
    limit: number = 10
  ): Promise<RankingFesta[]> => {
    try {
      setLoading(true);
      setError(null);
      const data = await relatorioService.rankingFestas(limit);
      return data;
    } catch (err) {
      setError("Erro ao buscar ranking de festas");
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const obterEstatisticasFesta = async (
    idFesta: number
  ): Promise<EstatisticasFesta | null> => {
    try {
      setLoading(true);
      setError(null);
      const data = await relatorioService.estatisticasFesta(idFesta);
      return data;
    } catch (err) {
      setError("Erro ao buscar estatísticas da festa");
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const obterRankingAtleticas = async (): Promise<RankingAtletica[]> => {
    try {
      setLoading(true);
      setError(null);
      const data = await relatorioService.rankingAtleticas();
      return data;
    } catch (err) {
      setError("Erro ao buscar ranking de atléticas");
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const obterDistribuicaoCursos = async (): Promise<DistribuicaoCursos[]> => {
    try {
      setLoading(true);
      setError(null);
      const data = await relatorioService.distribuicaoCursos();
      return data;
    } catch (err) {
      setError("Erro ao buscar distribuição de cursos");
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const obterComparacaoCategorias = async (): Promise<
    ComparacaoCategoria[]
  > => {
    try {
      setLoading(true);
      setError(null);
      const data = await relatorioService.comparacaoCategorias();
      return data;
    } catch (err) {
      setError("Erro ao buscar comparação de categorias");
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const obterEstatisticasTipoFesta = async (): Promise<
    EstatisticaTipoFesta[]
  > => {
    try {
      setLoading(true);
      setError(null);
      const data = await relatorioService.estatisticasTipoFesta();
      return data;
    } catch (err) {
      setError("Erro ao buscar estatísticas por tipo de festa");
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const obterAlunosAtivos = async (
    limit: number = 10
  ): Promise<AlunoAtivo[]> => {
    try {
      setLoading(true);
      setError(null);
      const data = await relatorioService.alunosAtivos(limit);
      return data;
    } catch (err) {
      setError("Erro ao buscar alunos ativos");
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const obterTendenciaTemporal = async (): Promise<TendenciaTemporal[]> => {
    try {
      setLoading(true);
      setError(null);
      const data = await relatorioService.tendenciaTemporal();
      return data;
    } catch (err) {
      setError("Erro ao buscar tendência temporal");
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const obterMaiorParticipacao = async (
    limit: number = 10
  ): Promise<MaiorParticipacao[]> => {
    try {
      setLoading(true);
      setError(null);
      const data = await relatorioService.maiorParticipacao(limit);
      return data;
    } catch (err) {
      setError("Erro ao buscar festas com maior participação");
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    obterRankingFestas,
    obterEstatisticasFesta,
    obterRankingAtleticas,
    obterDistribuicaoCursos,
    obterComparacaoCategorias,
    obterEstatisticasTipoFesta,
    obterAlunosAtivos,
    obterTendenciaTemporal,
    obterMaiorParticipacao,
  };
};
