import { db } from "@/lib/firebase/instances";
import { collection, DocumentData, getDocs, limit, orderBy, Query, query, QueryDocumentSnapshot, startAfter, where } from "firebase/firestore";

type FilterProdutos = {
  classe?: string;
  pesquisa?: string;
  lastVisible: QueryDocumentSnapshot<DocumentData, DocumentData> | null;
  limit: number;
};


function applyQueryFilters(q: Query, filter: FilterProdutos) {
  if (filter && filter.pesquisa) {
    q = query(
      q,
      where("arryList", "array-contains-any", filter.pesquisa.toUpperCase().split(" "))
    );
  }

  if (filter && filter.classe) {
    q = query(q, where("classe", "==", filter.classe));
  }

  q = query(q, orderBy("classe"));

  q = query(q, limit(filter.limit));
  
  q = query(q, orderBy("chave", "desc"));

  if (filter && filter.lastVisible) {
    q = query(q, startAfter(filter.lastVisible));
  }

  q = query(q, where("preco", ">", 0));

  return q;
}

export async function getProdutos(filters: FilterProdutos) {
  let ultimo = false;
  let q = query(collection(db, "recursos"));

  q = applyQueryFilters(q, filters);
  const results = await getDocs(q);

  const produtos = results.docs.map((doc) => {
    const dt = doc.data();

    return {
      id: doc.id,
      codigo: dt.codigo,
      nome: dt.nome,
      codigoProprio: dt.codigoProprio,
      referenciaPrincipal: dt.referenciaPrincipal,
      ean: dt.ean,
      codigoAntigo: dt.codigoAntigo,
      gtin12: dt.gtin12,
      gtin13: dt.gtin13,
      gtin14: dt.gtin14,
      classe: dt.classe,
      chave: dt.chave,
      preco: dt.preco,
      imgUrl: dt.imgUrl,
      marca: dt.marca,
      ncm: dt.ncm,
      unidadeMedida: {
        chave: dt.unidadeMedida?.chave,
        codigo: dt.unidadeMedida?.codigo,
        codtabfisc: dt.unidadeMedida?.codtabfisc,
        nome: dt.unidadeMedida?.nome,
      },
    };
  });
  if (results.docs.length == filters.limit) {
    produtos.pop();
  } else {
    ultimo = true;
  }
  return {
    pageParams: {
      lastVisible: results.docs[results.docs.length - 1],
      classe: filters.classe,
      ultimo: ultimo,
    },
    produtos: produtos,
  };
}
