import axios from "axios";
import { constantes } from "../config/constantes";
import { admin } from "../firebaseInicializer";
import { Estabelecimentos, Estabelecimento } from "../models/type-estabelecimentos";


export class EstabelecimentosService {
  apiUrl = constantes.apiUrl + constantes.rotaEstabelecimentos
  gravadosQtd = 0
  versao = 0
  db = admin.firestore();

  gravaEstabelecimentos = async () => {
    const estabelecimentos = await this.consultaEstabelecimentos();
    const estabelecimentoCollection = this.db.collection("estabelecimentos");
    const batch = this.db.batch();

    const estabelecimento = estabelecimentos.estabelecimentos


    await this.apagaColecaoEstabelecimentos();

    for (const estabeleci of estabelecimento) {
      const docId = estabeleci.chave.toString();
      const data = await this.montaEstabelecimentos(estabeleci);
      batch.set(estabelecimentoCollection.doc(docId), data);
    }
    await batch.commit();

    this.gravadosQtd = estabelecimento.length;
  };

  apagaColecaoEstabelecimentos = async () => {
    await this.db.collection("estabelecimentos").doc().delete();
    console.log("coleção deletada")
  };
  consultaEstabelecimentos = async (): Promise<Estabelecimentos> => {
    const apiResponse = await axios.get(this.apiUrl +  this.versao, {
      headers: {
        Authorization: constantes.token,
      },
    });
    const responseData = apiResponse.data;

    if (!responseData.estabelecimentos) {
      throw new Error("Dados de estabelecimentos não encontrados na resposta da API.");
    }

    const estabelecimento: Estabelecimentos = responseData || {};
    return estabelecimento;
  }
  montaEstabelecimentos = async (estabelecimento: Estabelecimento) => {
    return {
      uf: estabelecimento.uf ?? '',
      chave: estabelecimento.chave ?? 0.0,
      codigo: estabelecimento.codigo ?? '',
      empresa: estabelecimento.empresa ?? '',
      cidade: estabelecimento.cidade ?? '',
      bairro: estabelecimento.bairro ?? '',
      email: estabelecimento.email ?? '',
      fone: estabelecimento.fone ?? '',
      endereco: estabelecimento.endereco ?? '',
      cnpj: estabelecimento.cnpj ?? '',
      imagem: estabelecimento.imagem ?? '',
      locescritu: estabelecimento.locescritu ? {
        chave: estabelecimento.locescritu.chave,
        nome: estabelecimento.locescritu.nome,
        codigo: estabelecimento.locescritu.codigo
      } : null
    }
  }
}