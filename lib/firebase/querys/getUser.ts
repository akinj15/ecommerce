/* eslint-disable @typescript-eslint/no-explicit-any */
import { doc, Firestore, getDoc } from "firebase/firestore";


export async function getClientes(
  db: Firestore,
  filters: { id: string },
) {
  const docRef = doc(db, "cliente", filters.id);
  const docSnap = await getDoc(docRef);
  let retorno;
  if (docSnap.exists()) {
    const dt = docSnap.data();
    retorno = {
      id: docSnap.id,
      nome: dt.nome,
      cpf: dt.cpf,
      telefone: dt.telefone,
      carrinho: dt.carrinho,
    };
  }
  return retorno;
}

export async function getClienteById(
  db: Firestore,
  filters: { id: string },
  cb: (e: any) => void,
) {
  const docRef = doc(db, "cliente", filters.id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const dt = docSnap.data();
    cb(dt);
  }
}