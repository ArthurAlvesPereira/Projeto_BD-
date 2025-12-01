export type TipoQuestao = 'NOTA' | 'TEXTO' | 'MULTIPLA_ESCOLHA';

export interface Questao {
  idQuestao: number;
  enunciado: string;
  tipo: TipoQuestao;
}
