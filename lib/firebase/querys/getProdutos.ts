import { db } from "@/lib/firebase/instances";
import { collection, getDocs, limit, orderBy, Query, query, where } from "firebase/firestore";

type FilterProdutos = {
  classe: string;
  limit?: number;
  orderBy?: string;
};


function applyQueryFilters(q: Query, filter: FilterProdutos) {
  if (filter && filter.classe) {
    q = query(q, where("classe", "==", filter.classe));
  }
  if (filter && filter.orderBy) {
    q = query(q, orderBy(filter.orderBy));
  }
  if (filter && filter.limit) {
    q = query(q, limit(filter.limit));
  }
  q = query(q, where("preco", ">", 0));
  return q;
}

export async function getProdutos(filters: FilterProdutos) {
  let q = query(collection(db, "recursos"));

  q = applyQueryFilters(q, filters);
  const results = await getDocs(q);
  return results.docs.map((doc) => {
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
}
