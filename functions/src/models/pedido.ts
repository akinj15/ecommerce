import { Endereco } from "./cliente";

export type Pedido = {
  id?: string;
  chcriacao?: number;
  emissao: Date;
  status: StatusPedido;
  endereco: Endereco | null;
  pagamento: string | null;
  produtos: ItemCarrinho[] | null;
  estabeleci?: number;
  erro?: string;
  cliente: {
    chave: number;
    nome?: string;
    cpf?: string;
    id: string;
    telefone: string;
  };
};

type StatusPedido = {
  codigo: string;
  nome: string;
  mensagem?: string;
};

type ItemCarrinho = {
  id: string;
  chave: number;
  nome: string;
  cor?: string;
  tamanho?: string;
  imgUrl: string;
  quantidade: number;
  preco: number;
};

export interface PedidoEnvio {
  frete?: number;
  itens: ItemPedido[];
  cliente: string;
  emissao: string;
  desconto?: number;
  descperc?: number;
  acrescimo?: number;
  idDocumento: string;
  observacao?: string;
  // pagamentos: Pagamento[];
  chaveEstabelecimento?: number;
}

export interface ItemPedido {
  idProduto: number;
  unitario: number;
  observacao?: string;
  quantidade: number;
}

export type PedidoResponse = {
  mensagem: string;
  pedido: { chave: number, status: StatusPedido };
  sucesso: boolean
};