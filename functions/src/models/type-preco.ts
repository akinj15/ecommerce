
export interface PrecoResponse {
  retorno: Precos[];
}

export interface Precos {
  codigo: string;
  nome: string;
  preco: number;
  recurso: number;
}

