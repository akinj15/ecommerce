import axios from "axios";
import { constantes } from "../config/constantes";
import {
  Cliente,
  ClienteResponse,
  Endereco,
  EnderecoResponse,
} from "../models";
import { admin } from "../firebaseInicializer";

export class ClienteService {
  db = admin.firestore();

  gravaCliente = async (cliente: Cliente, id?: string) => {
    try {
      const res = await axios.post<ClienteResponse>(
        constantes.apiUrl + constantes.rotaClientes,
        this.montaDadosEnvioCliente(cliente),
        {
          headers: {
            Authorization: constantes.token,
          },
        }
      );

      const dados = res.data;
      if (dados.versao) {
        const cliente = dados.clientes[0];
        cliente.chave = cliente.chave;
      }
    } finally {
      if (id) {
        await this.db
          .collection("/cliente")
          .doc(id)
          .set(cliente, { merge: true });
      }
    }
  };

  montaDadosEnvioCliente = async (cliente: Cliente) => {
    return {
      chave: cliente.chave,
      fone: cliente.telefone,
      nome: cliente.nome || cliente.telefone,
      codigo: cliente.nome || cliente.telefone,
      cgccpf: cliente.cpf,
    };
  };

  gravaEndereco = async (
    endereco: Endereco,
    id?: string,
    clienteId?: string
  ) => {
    try {
      const res = await axios.post<EnderecoResponse>(
        constantes.apiUrl + constantes.rotaCadastraEndereco,
        this.montaDadosEnvioEndereco(endereco),
        {
          headers: {
            Authorization: constantes.token,
          },
        }
      );
      const data = res.data;
      if (data.endereco && data.endereco.length && data.endereco[0].chave) {
        endereco.chave = data.endereco[0].chave;
      }
    } catch (e) {
      throw e;
    } finally {
      if (id && clienteId) {
        await this.db
          .collection("/cliente")
          .doc(clienteId)
          .collection("/endereco")
          .doc(id)
          .set(endereco, { merge: true });
      }
    }
  };

  montaDadosEnvioEndereco = async (endereco: Endereco) => {
    return {
      chave: endereco.chave,
      cliente: endereco.cliente,
      rua: endereco.rua,
      cep: endereco.cep,
      complemento: endereco.complemento,
      numero: endereco.numero,
      uf: endereco.uf,
      cidade: endereco.cidade,
      estado: endereco.estado,
    };
  };
}
