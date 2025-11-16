import api from "./api";

export interface Festa {
  id: number;
  nome: string;
  horario: string;
  tipoFesta: string;
  local: string;
}

export const festaService = {
  async listarTodas(): Promise<Festa[]> {
    const response = await api.get("/festas");
    return response.data;
  },

  async buscarPorId(id: number): Promise<Festa> {
    const response = await api.get(`/festas/${id}`);
    return response.data;
  },

  async buscarPorOrganizador(cnpj: string): Promise<Festa[]> {
    const response = await api.get(`/festas/organizador/${cnpj}`);
    return response.data;
  },

  async criar(
    festa: Omit<Festa, "id">,
    cnpjOrganizador: string
  ): Promise<void> {
    await api.post("/festas", festa, {
      params: { cnpjOrganizador },
    });
  },
};
