import { Endereco } from "./endereco";
import { ItemCarrinho } from "./usuario";

export type NovoPedido = {
  endereco: Endereco | null;
  pagamento: string | null;
  produtos: ItemCarrinho[] | null;
};
