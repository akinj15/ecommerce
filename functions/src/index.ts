/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import * as logger from "firebase-functions/logger";
import { https } from "firebase-functions/v2";
import { RecursoService } from "./services";
import { PrecoService } from "./services/preco.service";
import { EstabelecimentosService } from "./services/estabelecimentos.service";

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