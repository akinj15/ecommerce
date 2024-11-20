export interface Condicoes {
  codigo: string;
  chave: number;
  nome: string;
  tipoParcelamento: string;
  tipoDeDocumento: {
    tipo: string ;
    nome: string ;
  }[] ;
  numParcelas?: {
    maximo?: number;
    minimo?: number;
  };
  bandeira?: string[];
  rede: string;
  tipo:string
}


export interface CondicoesDePagamento {
  erros: never[];
  condicoes: Condicoes[];
}

