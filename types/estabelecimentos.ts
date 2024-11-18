export interface Estabelecimento {
  id: string;
  uf: string;
  empresa: string;
  codigo: string;
  cidade: string;
  bairro: string;
  chave: number;
  email: string;
  fone: string;
  endereco: string;
  cnpj: string;
  locescritu?: {
    chave: null;
    nome: null;
    codigo: null;
  } | null;
  imagem: string;
}
