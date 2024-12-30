import axios from "axios";
import { constantes } from "../config/constantes";
import {
  Pedido,
  PedidoResponse,
  PedidoEnvio,
} from "../models";
import { admin } from "../firebaseInicializer";

export class PedidoService {
  db = admin.firestore();

  gravaPedido = async (pedido: Pedido, id: string, clienteId: string) => {
    try {
      const res = await axios.post<PedidoResponse>(
        constantes.apiUrl + constantes.rotaPedidos,
        this.montaDadosEnvioPedido(pedido, id),
        {
          headers: {
            Authorization: constantes.token,
          },
        }
      );
      console.log("res: ", res);

      const dados = res.data;
      const code = res.status;
      if (code !== 200) {
        pedido.erro = dados.mensagem;
      }
      if (dados.sucesso) {
        pedido.status = {
          codigo: dados.pedido.status.codigo,
          nome: dados.pedido.status.nome,
          // mensagem: dados.pedido.status.mensagem,
        };
        this.enviaMensagemWhatsapp(pedido);
      }
    } finally {
      await this.db
        .collection("/cliente")
        .doc(clienteId)
        .collection("/pedido")
        .doc(id)
        .set(pedido, { merge: true });
    }
  };

  montaDadosEnvioPedido = (pedido: Pedido, id: string): PedidoEnvio => {
    const d = new Date();
    const produtos =
      pedido.produtos?.map((produto) => {
        return {
          idProduto: produto.chave,
          quantidade: produto.quantidade,
          unitario: produto.preco,
        };
      }) || [];
    return {
      emissao: `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`,
      itens: produtos,
      cliente: pedido.cliente.chave.toString(),
      desconto: 0,
      descperc: 0,
      acrescimo: 0,
      frete: 0,
      idDocumento: id || "",
      observacao: "",
      chaveEstabelecimento: pedido.estabeleci || 432358,
    };
  };

  enviaMensagemWhatsapp = async (pedido: Pedido) => {
    const mensagem = "Pedido realizado com sucesso!";
    const telefone = pedido.cliente.telefone.replace(/\D/g, ''); ;

    try {
      const url = constantes.whatsappUrl +
        constantes.whatsappIdentificadorNumero +
        "/messages";
      const body = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: "55" + telefone,
        type: "text",
        text: {
          preview_url: true,
          body: mensagem,
        },
      };

      const header = {
        headers: {
          Authorization: constantes.whatsappToken,
          "Content-Type": "application/json",
        },
      };

      const res = await axios.post(url, body, header);
      return res.data;
    } catch (error) {
      throw error;
    }
  };
}
