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