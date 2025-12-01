export interface Resposta {
  idQuestao: number;
  valorNumerico?: number;
  valorTexto?: string;
  // Opcional: para exibição
  enunciado?: string;
}

export interface Avaliacao {
  idAvaliacao?: number;
  idFesta: number;
  matriculaAluno: number;
  comentarioGeral: string;
  dataHoraAvaliacao?: string;
  respostas: Resposta[];
}

export interface NovaAvaliacao {
  idFesta?: number;
  matriculaAluno?: number;
  comentarioGeral: string;
  respostas: Resposta[];
}
