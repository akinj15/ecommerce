export type ClassesProdutos = {
  id: string;
  nome: string;
};

export interface Estabelecimento {
  chave: number;
  nome: string;
  codigo: string;
}

export interface UnidadeMedida {
  chave: number;
  codigo: string;
  codtabfisc: string;
  nome: string;
}

export interface Produto {
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
  unidadeMedida: UnidadeMedida;
  imgUrl: string;
  nome: string;
  marca: string;
  ncm: string;
  id: string;
}