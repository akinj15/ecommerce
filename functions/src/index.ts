/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import * as logger from "firebase-functions/logger";
import { https, logger } from "firebase-functions/v2";

import {
  Change,
  FirestoreEvent,
  onDocumentCreated,
  onDocumentUpdated,
  QueryDocumentSnapshot,
} from "firebase-functions/v2/firestore";

import { PagamentosService, RecursoService, ClienteService, PedidoService } from "./services";
import { PrecoService } from "./services/preco.service";
import { EstabelecimentosService } from "./services/estabelecimentos.service";
import { Endereco, Cliente, Pedido } from "./models";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


export const getRecursos = https.onRequest(
  {
    timeoutSeconds: 3600,
    memory: "512MiB",
  },

  async (req, res) => {
    try {
      const recursoService = new RecursoService();
      await recursoService.gravaRecursosRecursivo(1, 10000);
      const msg =
        `${recursoService.gravadosQtd} recursos gravados com sucesso\nVersão:` +
        recursoService.versao;
      console.log(msg);
      res.send(msg);
    } catch (error) {
      console.error("Erro na requisição HTTP:", error);
      res.status(500).send("Erro ao gravar os dados de Recursos no Firestore.");
    }
  }
);

export const getClasseRecursos = https.onRequest(
  {
    timeoutSeconds: 3600,
    memory: "512MiB",
  },

  async (req, res) => {
    try {
      const recursoService = new RecursoService();
      await recursoService.gravaClassesRecursos();
      const msg =
        `${recursoService.gravadosQtd} recursos gravados com sucesso`
      console.log(msg);
      res.send(msg);
    } catch (error) {
      console.error("Erro na requisição HTTP:", error);
      res.status(500).send("Erro ao gravar os dados de Recursos no Firestore.");
    }
  }
);

export const getPreco = https.onRequest(
  {
    timeoutSeconds: 3600,
    memory: "512MiB",
  },

  async (req, res) => {
    try {
      const precoService = new PrecoService();
      await precoService.gravaPrecoRecursivo(1, 5000);
      const msg = `${precoService.gravadosQtd} preços gravados com sucesso`;
      console.log(msg);
      res.status(200).send(msg);
    } catch (error) {
      console.error("Erro na requisição HTTP:", error);
      res.status(500).send("Erro ao gravar os dados de preço no Firestore.");
    }
  }
);

export const getEstabelecimentos = https.onRequest(async (req, resp) => {
  try {
    const estabelecimentoService = new EstabelecimentosService();

    await estabelecimentoService.gravaEstabelecimentos();

    const msg =
      estabelecimentoService.gravadosQtd +
      " estabelecimentos gravados com sucesso\n ";
    console.log(msg);
    resp.send(msg);
  } catch (error) {
    console.error("Erro na requisição HTTP:", error);
    resp
      .status(500)
      .send("Erro ao gravar os dados de estabelecimentos no Firestore.");
  }
});

export const getCondicoesDePagamento = https.onRequest(async (req, resp) => {
  try {
    const pagamentosService = new PagamentosService();

    await pagamentosService.gravaPagamentos();

    const msg =
      pagamentosService.gravadosQtd +
      " condições de pagamento gravados com sucesso\n ";
    console.log(msg);
    resp.send(msg);
  } catch (error) {
    console.error("Erro na requisição HTTP:", error);

    resp
      .status(500)
      .send("Erro ao gravar os dados de pagamentos no Firestore.");
  }
});

export const noCriaCliente = onDocumentCreated(
  "/cliente/{clienteId}",
  async (
    event: FirestoreEvent<
      QueryDocumentSnapshot | undefined,
      { clienteId: string }
    >
  ) => {
    const clienteService = new ClienteService();
    const cliente = (event.data?.data() as Cliente) || undefined;
    const clienteId = event.params.clienteId;

    if (!cliente) {
      logger.error(
        `Usuario ${clienteId} não encontrado.`,
        { structuredData: true }
      );
      return;
    }
    try {
      clienteService.gravaCliente(cliente, clienteId);
    } catch (e) {
      logger.error("noCriaCliente", { structuredData: true }, e);
    }
  }
);

export const noAtualizaCliente = onDocumentUpdated(
  "/cliente/{clienteId}",
  async (
    event: FirestoreEvent<
      Change<QueryDocumentSnapshot> | undefined,
      Record<string, string>
    >
  ) => {
    const clienteService = new ClienteService();
    const cliente = (event.data?.after.data() as Cliente) || undefined;

    if (cliente) {
      try {
        clienteService.gravaCliente(cliente);
      } catch (e) {
        logger.error("onDocumentUpdated ", { structuredData: true }, e);
      }
    }
  }
);

export const noCriaEnderecoCliente = onDocumentCreated(
  "/cliente/{clienteId}/endereco/{enderecoId}",
  async (
    event: FirestoreEvent<
      QueryDocumentSnapshot | undefined,
      { clienteId: string; enderecoId: string }
    >
  ) => {
    const clienteService = new ClienteService();
    const clienteId = event.params.clienteId;
    const enderecoId = event.params.enderecoId;
    const endereco = (event.data?.data() as Endereco) || undefined;

    if (endereco){
      try {
        clienteService.gravaEndereco(endereco, enderecoId, clienteId);
      } catch (e) { 
        logger.error("noCriaEnderecoCliente", { structuredData: true }, e);
      }
    }
    
  }
);

export const noAtualizaEnderecoCliente = onDocumentUpdated(
  "/cliente/{clienteId}/endereco/{enderecoId}",
  async (
    event: FirestoreEvent<
      Change<QueryDocumentSnapshot> | undefined,
      { clienteId: string; enderecoId: string }
    >
  ) => {
    const clienteService = new ClienteService();
    const clienteId = event.params.clienteId;
    const enderecoId = event.params.enderecoId;
    const endereco = ( event.data?.after.data() as Endereco) || undefined;

    if (endereco) {
      try {
        clienteService.gravaEndereco(endereco, enderecoId, clienteId);
      } catch (e) {
        logger.error("noAtualizaEnderecoCliente", { structuredData: true }, e);
      }
    }
  }
);

export const noCriaPedido = onDocumentCreated(
  "/cliente/{clienteId}/pedido/{pedidoId}",
  async (
    event: FirestoreEvent<
      QueryDocumentSnapshot | undefined,
      { clienteId: string; pedidoId: string }
    >
  ) => {
    const pedidoService = new PedidoService();
    const clienteId = event.params.clienteId;
    const pedidoId = event.params.clienteId;
    const pedido = (event.data?.data() as Pedido) || undefined;

    if (pedido) {
      try {
        pedidoService.gravaPedido(pedido, pedidoId, clienteId);
      } catch (e) {
        logger.error("noCriaEnderecoCliente", { structuredData: true }, e);
      }
    } 
  }
);
