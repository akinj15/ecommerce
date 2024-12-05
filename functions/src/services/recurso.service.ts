/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { constantes } from "../config/constantes";
import { classeRecurso, Recurso } from "../models";
import { admin } from "../firebaseInicializer";

export class RecursoService {
  apiUrl = constantes.apiUrl + constantes.rotaRecursos;
  versao = 0;
  gravadosQtd = 0;
  db = admin.firestore();

  async gravaRecursosRecursivo(
    pagina: number,
    porpagina: number
  ): Promise<void> {
    const { recursos, totalPaginas } = await this.consultaRecursos(
      pagina,
      porpagina
    );
    if (recursos.length === 0) {
      return;
    }

    await this.gravaRecursos(recursos);
    if (pagina < totalPaginas) {
      const proximaPagina = pagina + 1;
      await this.gravaRecursosRecursivo(proximaPagina, porpagina);
    } else {
      await this.finalizaGravacao(); // Chamar para finalizar no final
    }
  }

  async gravaRecursos(recursos: Recurso[]): Promise<void> {
    const recursosCollection = this.db.collection("recursos");
    const batchSize = 1000;

    const batches = [];

    for (let i = 0; i < recursos.length; i += batchSize) {
      const batch = this.db.batch();
      const recursosSlice = recursos.slice(i, i + batchSize);
      for (const recurso of recursosSlice) {
        const docId = recurso.chave.toString();
        const data = await this.montaRecursos(recurso);
        batch.set(recursosCollection.doc(docId), { ...data });
      }

      batches.push(batch.commit());
      this.gravadosQtd += recursosSlice.length;
    }

    await Promise.all(batches);
  }

  async consultaRecursos(
    pagina: number,
    porpagina: number
  ): Promise<{ recursos: Recurso[]; totalPaginas: number }> {
    const { ultimaversao, primeiraRequisicao } =
      await this.consultaVersaoEprimeiraRequisicao();

    if (primeiraRequisicao) {
      this.versao = 0; // Se primeiraRequisicao for true, configurar versao como 0
    } else {
      this.versao = ultimaversao; // Caso contrário, consultar a versão
      console.log(this.apiUrl + this.versao);
    }

    const apiResponse = await axios.get(this.apiUrl + this.versao, {
      headers: {
        pagina: pagina,
        porpagina: porpagina,
        Authorization: constantes.token,
      },
    });

    const responseData = apiResponse.data;
    console.log(responseData)
    if (!responseData.recursos) {
      throw new Error("Dados de clientes não encontrados na resposta da API.");
    }

    if (apiResponse.status !== 200) {
      throw new Error("Erro ao obter dados da API: " + apiResponse.statusText);
    }

    if (responseData.versao > 0) {
      await this.atualizaUltimaVersao(responseData.versao);
    }

    if (!responseData.paginacao || !responseData.paginacao.totalPaginas) {
      throw new Error("Dados de paginação não encontrados na resposta da API.");
    }

    return {
      recursos: responseData.recursos || [],
      totalPaginas: responseData.paginacao.totalPaginas,
    };
  }

  async consultaVersaoEprimeiraRequisicao() {
    const doc = await this.db.collection("versoes").doc("RECURSOS").get();
    const data = doc.data();

    // Verifica se o campo 'versao' existe e retorna os valores adequadamente
    return {
      ultimaversao: data?.versao?.ultimaversao || 0,
      primeiraRequisicao: data?.versao?.primeiraRequisicao || false,
    };
  }

  async atualizaUltimaVersao(novaVersao: number) {
    await this.db
      .collection("versoes")
      .doc("RECURSOS")
      .set(
        {
          versao: {
            ultimaversao: novaVersao,
          },
        },
        { merge: true }
      ); // Merge para não sobrescrever outros campos no mapa
  }

  async atualizaprimeiraRequisicao(valor: boolean) {
    await this.db
      .collection("versoes")
      .doc("RECURSOS")
      .set(
        {
          versao: {
            primeiraRequisicao: valor,
          },
        },
        { merge: true }
      ); // Merge para não sobrescrever outros campos no mapa
  }

  async finalizaGravacao() {
    await this.atualizaprimeiraRequisicao(false); // Define 'primeiraRequisicao' como false após gravar todos os recursos
  }

  async montaRecursos(recurso: Recurso): Promise<any> {
    const estoqueFormatted = recurso.estoque.map((item) => ({
      quantidade: item.quantidade ?? "",
      estabelecimento: item.estabelecimento.chave ?? "",
      nomeEstabelecimento: item.estabelecimento.nome ?? "",
      codigoEstabelecimento: item.estabelecimento.codigo ?? "",
    }));

    // Inicializa nomePartes e adiciona nome, código e cgccpf em maiúsculo
    const arryList = [
      ...(recurso.nome?.toLocaleUpperCase().split(" ") || []), // Adiciona as partes do nome
      recurso.ean?.toLocaleUpperCase(),
      recurso.nome?.toLocaleUpperCase(),
      recurso.gtin12?.toLocaleUpperCase(),
      recurso.gtin13?.toLocaleUpperCase(),
      recurso.gtin14?.toLocaleUpperCase(),
      recurso.codigo?.toLocaleUpperCase(),
      recurso.codigoProprio?.toLocaleUpperCase(),
      recurso.codigoAntigo?.toLocaleUpperCase(),
      recurso.referenciaPrincipal?.toLocaleUpperCase(),
    ].filter(Boolean); // Remove valores nulos ou indefinidos

    return {
      codigo: recurso.codigo?.toLocaleUpperCase() || "",
      codigoProprio: recurso.codigoProprio?.toLocaleUpperCase() || "",
      codigoAntigo: recurso.codigoAntigo?.toLocaleUpperCase() || "",
      referenciaPrincipal:
        recurso.referenciaPrincipal?.toLocaleUpperCase() || "",
      classe: recurso.classe,
      preco: recurso.preco,
      estoque: estoqueFormatted,
      unidadeMedida: recurso.unidadeMedida || {},
      imgUrl: recurso.imgUrl,
      nome: recurso.nome?.toLocaleUpperCase() || "",
      marca: recurso.marca,
      ncm: recurso.ncm,
      ean: recurso.ean?.toLocaleUpperCase() || "",
      gtin12: recurso.gtin12?.toLocaleUpperCase() || "",
      gtin13: recurso.gtin13?.toLocaleUpperCase() || "",
      gtin14: recurso.gtin14?.toLocaleUpperCase() || "",
      chave: recurso.chave,
      arryList: arryList,
      erros: [],
    };
  }

  async consultaClassesRecursos(): Promise<{
    classesRecursos: classeRecurso[];
  }> {
    const apiResponse = await axios.get(this.apiUrl + "classes", {
      headers: {
        Authorization: constantes.token,
      },
    });

    const responseData = apiResponse.data;
    console.log("responseData");
    console.log(responseData);
    if (!responseData.classesRecursos) {
      throw new Error("Classes não encontradas na resposta da API.");
    }

    if (apiResponse.status !== 200) {
      throw new Error("Erro ao obter dados da API: " + apiResponse.statusText);
    }

    return {
      classesRecursos: responseData.classesRecursos || [],
    };
  }

  async gravaClassesRecursos(): Promise<void> {
    const { classesRecursos } = await this.consultaClassesRecursos();
    if (classesRecursos.length === 0) {
      return;
    }

    const classeRecursosCollection = this.db.collection("classesRecursos");
    const batchSize = 1000;

    const batches = [];

    for (let i = 0; i < classesRecursos.length; i += batchSize) {
      const batch = this.db.batch();
      const classeSlice = classesRecursos.slice(i, i + batchSize);
      for (const classe of classeSlice) {
        const docId = classe.chave.toString();
        batch.set(classeRecursosCollection.doc(docId), { nome: classe.nome });
      }

      batches.push(batch.commit());
      this.gravadosQtd += classeSlice.length;
    }

    await Promise.all(batches);

  }
}  