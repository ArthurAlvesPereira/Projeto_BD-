export type TipoQuestao = "NOTA" | "TEXTO" | "MULTIPLA_ESCOLHA" | "BOOLEANO";

export interface Questao {
  idQuestao: number;
  enunciado: string;
  tipo: TipoQuestao;
}
