import { Endereco } from "./endereco";

export type Usuario = {
  id?: string;
  nome: string;
  telefone: string;
  cpf: string;
  endereco?: Endereco;
};