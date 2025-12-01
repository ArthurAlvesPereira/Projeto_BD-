import api from "./api";

export const relatorioService = {
  async rankingFestas(limit: number = 10) {
    const response = await api.get("/relatorios/ranking-festas", {
      params: { limit },
    });
    return response.data;
  },

  async estatisticasFesta(idFesta: number) {
    const response = await api.get(`/relatorios/festa/${idFesta}/estatisticas`);
    return response.data;
  },

  async rankingAtleticas() {
    const response = await api.get("/relatorios/ranking-atleticas");
    return response.data;
  },

  async distribuicaoCursos() {
    const response = await api.get("/relatorios/distribuicao-cursos");
    return response.data;
  },

  async comparacaoCategorias() {
    const response = await api.get("/relatorios/categorias-comparacao");
    return response.data;
  },

  async estatisticasTipoFesta() {
    const response = await api.get("/relatorios/tipo-festa");
    return response.data;
  },

  async tendenciaTemporal() {
    const response = await api.get("/relatorios/tendencia-temporal");
    return response.data;
  },

  async alunosAtivos(limit: number = 10) {
    const response = await api.get("/relatorios/alunos-ativos", {
      params: { limit },
    });
    return response.data;
  },

  async maiorParticipacao(limit: number = 10) {
    const response = await api.get("/relatorios/maior-participacao", {
      params: { limit },
    });
    return response.data;
  },
};
