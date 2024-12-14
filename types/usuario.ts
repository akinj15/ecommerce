import { Endereco } from "./endereco";


export type ItemCarrinho = {
  id: string;
  chave: number;
  nome: string;
  cor?: string;
  tamanho?: string;
  imgUrl: string;
  quantidade: number;
  preco: number;
};

export type Usuario = {
  id?: string;
  chave?: number;
  nome: string;
  telefone: string;
  cpf: string;
  endereco?: Endereco;
  carrinho?: ItemCarrinho[];
};