export type Usuario = {
  id: string;
  chave?: string;
  nome: string;
  telefone: string;
  cpf: string;
};

export type Endereco = {
  id?: string;
  rua: string;
  cep: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  uf: string;
  complemento: string;
};

export type UsuarioResponse = {
  erros: [];
  clientes: { chave: string }[];
  versao: number;
};