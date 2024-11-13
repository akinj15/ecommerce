import { Endereco } from "./endereco";


export type ItemCarrinho = {
  chave: number;
  nome: string;
  cor?: string;
  tamanho?: string;
  imgUrl: string;
  quantidade: number;
};

export type Usuario = {
  id?: string;
  nome: string;
  telefone: string;
  cpf: string;
  endereco?: Endereco;
  carrinho?: ItemCarrinho[];
};