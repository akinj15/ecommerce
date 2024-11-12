export interface Estabelecimento {
  chave: number;
  nome: string;
  codigo: string;
}

export interface UnidadeMedida {
  chave: number,
  codigo: string,
  codtabfisc: string,
  nome: string
}

export interface Recurso {
  codigo: string;
  codigoProprio: string;
  referenciaPrincipal: string;
  codigoAntigo: string;
  ean: string;
  gtin12: string;
  gtin13: string;
  gtin14: string;
  classe: string;
  chave: number;
  preco: number;
  estoque: {
    quantidade: number;
    estabelecimento: Estabelecimento;
  }[];
  unidadeMedida: UnidadeMedida;
  imgUrl: string;
  nome: string;
  marca: string;
  ncm: string;
}

export interface RecursoSaldo {
  recurso: number,
  quantidade: number,
  estabelecimento: string,
  deposito: null,
  chaveEstabelecimento: number,
  codigoEstabelecimento: string;
}

export interface classeRecurso {
  chave: number;
  nome: string;
}


