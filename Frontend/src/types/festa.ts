import type { Questao } from "./questao";

export interface Festa {
  id: number;
  nome: string;
  horario: string;
  tipoFesta: string;
  local: string;
  questoes?: Questao[];
}

export interface NovaFesta {
  nome: string;
  horario: string;
  tipoFesta: string;
  local: string;
  questoesIds?: number[];
}
