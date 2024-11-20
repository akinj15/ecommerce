import axios from "axios";
import { constantes } from "../config/constantes";
import { Condicoes, CondicoesDePagamento } from "../models";
import { admin } from "../firebaseInicializer";

export class PagamentosService {
  apiUrl = constantes.apiUrl + constantes.rotaPagamentos
  gravadosQtd = 0
  db = admin.firestore();

  gravaPagamentos = async () => {
    const condicoesDePagamento = await this.consultaPagamentos();
    const condicoesCollection = this.db.collection("condicoesDePagamento");
    const batch = this.db.batch();
     
    const condicoes = condicoesDePagamento.condicoes
   
     await this.apagaColecaoPagamentos();
     
      for (const condicao of condicoes) {
        const docId = condicao.chave.toString();
        const data = await this.montaCondicoes(condicao);
        batch.set(condicoesCollection.doc(docId), data);
      } 
      await batch.commit();
    
    this.gravadosQtd = condicoes.length;
  };

  apagaColecaoPagamentos = async () => {
    await this.db.collection("condicoesDePagamento").doc().delete();
    console.log("coleção deletada")
  };
  
  consultaPagamentos = async (): Promise<CondicoesDePagamento> => {
    
    const apiResponse = await axios.get(this.apiUrl, {
      headers: {
        Authorization: constantes.token,
      },
    });
    const responseData = apiResponse.data;

    if (!responseData.condicoes) {
      throw new Error("Dados de condiçoes não encontrados na resposta da API.");
    }
    
    const condicoes: CondicoesDePagamento = responseData || {};
    return condicoes ;
  }


  montaCondicoes = async (condicao: Condicoes) => {
    return {
        chave: condicao.chave,
        tipoDeDocumento: {
          tipo: condicao.tipoDeDocumento[0],
          nome: condicao.codigo,
        },
        numParcelas: condicao.numParcelas || { maximo: null, minimo: null },
        bandeira: condicao.bandeira || [],
        rede: condicao.rede
      };
  }
}
