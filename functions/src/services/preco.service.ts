import axios from "axios";
import { constantes } from "../config/constantes";
import { admin } from "../firebaseInicializer";
import { Precos } from "../models/type-preco";

export class PrecoService {
  apiUrl = constantes.apiUrl + constantes.rotaPreco;
  gravadosQtd = 0;
  db = admin.firestore();

  async gravaPrecoRecursivo(pagina: number, porpagina: number): Promise<void> {
    const { precos, totalPaginas } = await this.consultaPreco(
      pagina,
      porpagina
    );
    if (precos.length === 0) {
      return;
    }

    await this.gravaPrecos(precos);

    if (pagina < totalPaginas) {
      const proximaPagina = pagina + 1;
      await this.gravaPrecoRecursivo(proximaPagina, porpagina);
    }
  }

  async consultaPreco(
    pagina: number,
    porpagina: number
  ): Promise<{ precos: Precos[]; totalPaginas: number }> {
    const apiResponse = await axios.get(this.apiUrl, {
      headers: {
        pagina: pagina,
        porpagina: porpagina,
        Authorization: constantes.token,
      },
    });

    const responseData = apiResponse.data;
    console.log(responseData);

    if (!responseData.precos) {
      throw new Error("Dados de preços não encontrados na resposta da API.");
    }

    if (apiResponse.status !== 200) {
      throw new Error("Erro ao obter dados da API: " + apiResponse.statusText);
    }

    if (!responseData.paginacao || !responseData.paginacao.totalPaginas) {
      throw new Error("Dados de paginação não encontrados na resposta da API.");
    }

    return {
      precos: responseData.precos || [],
      totalPaginas: responseData.paginacao.totalPaginas,
    };
  }

  async gravaPrecos(precos: Precos[]): Promise<void> {
    const recursosCollection = this.db.collection("recursos");

    const batchSize = 1000;
    const promises = [];

    for (let i = 0; i < precos.length; i += batchSize) {
      const batch = this.db.batch();
      const precoSlice = precos.slice(i, i + batchSize);

      for (const preco of precoSlice) {
        const docRef = recursosCollection.doc(String(preco.recurso));
        console.log(docRef + "Doc verificado");

        const docSnapshot = await docRef.get();
        if (docSnapshot.exists) {
          batch.update(docRef, { preco: preco.preco ?? 0 });
          this.gravadosQtd += 1;
        } else {
          console.log(
            `Nenhum documento encontrado para id do recurso: ${preco.recurso}`
          );
        }
      }

      promises.push(
        batch.commit().then(() => {
          console.log(
            `Batch commit realizado para ${precoSlice.length} recursos.`
          );
        })
      );
    }

    await Promise.all(promises);
  }
}
