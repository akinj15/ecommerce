import { Endereco } from "./endereco";
import { ItemCarrinho, Usuario } from "./usuario";

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
  cliente: Usuario | null;
};

