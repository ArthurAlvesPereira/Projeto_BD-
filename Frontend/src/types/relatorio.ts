export interface MediaPorCategoria {
  organizacao?: number;
  diversao?: number;
  preco?: number;
  localizacao?: number;
  seguranca?: number;
  // Campos alternativos da API
  mediadjs?: number;
  mediabebidas?: number;
  mediabanheiros?: number;
  medialocal?: number;
  mediaorganizacao?: number;
}

export interface DistribuicaoCurso {
  curso: string;
  quantidade: number;
}

export interface EstatisticasFesta {
  festa?: {
    id: number;
    titulo: string;
    horario: string;
    local: string;
  };
  // Campos alternativos da API
  nomefesta?: string;
  totalavaliacoes?: number;
  totalAvaliacoes?: number;
  mediaGeral?: number;
  mediageral?: number;
  mediaPorCategoria?: MediaPorCategoria;
  distribuicaoCursos?: DistribuicaoCurso[];
  // Campos diretos da API
  mediadjs?: number;
  mediabebidas?: number;
  mediabanheiros?: number;
  medialocal?: number;
  mediaorganizacao?: number;
}

export interface RankingFesta {
  id?: number;
  id_festa?: number;
  titulo?: string;
  nome?: string;
  mediaGeral?: number;
  mediageral?: number;
  mediageralfestas?: number;
  totalAvaliacoes?: number;
  organizadornome?: string;
  totalavaliacoes?: number;
}

export interface RankingAtletica {
  cnpj?: string;
  nome?: string;
  sigla?: string;
  mediaGeral?: number;
  mediageral?: number;
  mediageralfestas?: number;
  totalFestas?: number;
  totalfestasrealizadas?: number;
  totalAvaliacoes?: number;
  totalavaliacoes?: number;
}

export interface DistribuicaoCursos {
  curso?: string;
  codigocurso?: string;
  quantidadeAvaliacoes?: number;
  totalavaliacoes?: number;
  mediageral?: number;
}

export interface ComparacaoCategoria {
  categoria?: string;
  mediaGeral?: number;
  medianota?: number;
  melhorFesta?: string;
  melhorfesta?: string;
  piorFesta?: string;
  piorfesta?: string;
}

export interface EstatisticaTipoFesta {
  tipo?: string;
  tipofesta?: string;
  quantidadeFestas?: number;
  totalfestas?: number;
  mediaGeral?: number;
  mediageral?: number;
  totalAvaliacoes?: number;
  totalavaliacoes?: number;
  cursosdiferentes?: number;
}

export interface AlunoAtivo {
  matricula: number;
  nome: string;
  curso: string;
  quantidadeAvaliacoes: number;
}

export interface TendenciaTemporal {
  periodo: string;
  quantidadeAvaliacoes: number;
  mediaGeral: number;
  // Campos alternativos
  mes?: string;
  ano?: number;
  mediaperiodo?: number;
  mediageral?: number;
}

export interface MaiorParticipacao {
  id: number;
  titulo: string;
  organizadornome: string;
  totalAvaliacoes: number;
  mediaGeral: number;
}
