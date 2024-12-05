/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pedido } from "@/types/pedido";
import { collection, doc, Firestore, getDoc, getDocs, } from "firebase/firestore";


export async function getPedidosByClienteId(
  db: Firestore,
  filters: { id: string }
) {
  const querySnapshot = await getDocs(
    collection(db, "cliente", filters.id, "pedido")
  );
  const res: Pedido[] = [];
  querySnapshot.forEach((doc) => {
    const dt = doc.data();
    res.push({
      id: doc.id,
      endereco: dt.endereco,
      produtos: dt.produtos,
      pagamento: dt.pagamento,
      emissao: dt.emissao,
      status: dt.status,
      chcriacao: dt.chcriacao,
      cliente: null
    });
  });
  return res;
}

export async function getPedidoById(
  db: Firestore,
  filters: { id: string; idCliente: string },
) {
  const docRef = doc(db, "cliente", filters.idCliente, "pedido", filters.id);
  const docSnap = await getDoc(docRef);
  let res: Pedido = {} as Pedido;
  if (docSnap.exists()) {
    const dt = docSnap.data();
    res = {
      id: docSnap.id,
      endereco: dt.endereco,
      produtos: dt.produtos,
      pagamento: dt.pagamento,
      emissao: dt.emissao,
      status: dt.status,
      chcriacao: dt.chcriacao,
      cliente: null,
    };
  }
  return res;
}