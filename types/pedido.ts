import { Endereco } from "./endereco";
import { ItemCarrinho } from "./usuario";

export type NovoPedido = {
  endereco: Endereco | null;
  pagamento: string | null;
  produtos: ItemCarrinho[] | null;
};


export type StatusPedido = {
  codigo: string;
  nome: string;
};



export type Pedido = {
  id?: string;
  chcriacao?: number;
  emissao: Date;
  status: StatusPedido;
  endereco: Endereco | null;
  pagamento: string | null;
  produtos: ItemCarrinho[] | null;
  cliente: {
    chave: number;
    telefone: string;
    nome?: string;
    cpf?: string;
    id: string;
  };
};

