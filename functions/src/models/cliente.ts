export type Cliente = {
  id: string;
  chave?: string;
  nome: string;
  telefone: string;
  cpf: string;
};

export type Endereco = {
  id?: string;
  chave?: number;
  cliente: number;
  rua: string;
  cep: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  uf: string;
  complemento: string;
};

export type ClienteResponse = {
  erros: [];
  clientes: { chave: string }[];
  versao: number;
};

export type EnderecoResponse = {
  erros: [];
  endereco: { chave: number }[];
  versao: number;
};