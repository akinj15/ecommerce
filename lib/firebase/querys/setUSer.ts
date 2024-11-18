/* eslint-disable @typescript-eslint/no-explicit-any */
import { Endereco } from "@/types/endereco";
import { addDoc, collection, deleteDoc, doc, Firestore, setDoc, updateDoc } from "firebase/firestore";

export async function setClienteById(
  db: Firestore,
  id: string,
  dt: any,
  cb: (e: boolean) => void
) {
  try {
    await setDoc(doc(db, "cliente", id), dt);
  } finally {
    cb(false);
  }
}

export async function createClienteById(
  db: Firestore,
  id: string,
  dt: { telefone: string },
) {
  await setDoc(doc(db, "cliente", id), dt);
}

export async function setItemCarrinhoByIdCliente(
  db: Firestore,
  id: string,
  dt: any,
) {
  await addDoc(collection(db, "cliente", id, "carrinho"), dt);
}

export async function updateItemCarrinhoByIdCliente(
  db: Firestore,
  id: string,
  carrinhoId: string,
  dt: any
) {
  await updateDoc(doc(db, "cliente", id, "carrinho", carrinhoId), dt);
}

export async function deleteItemCarrinhoByIdCliente(
  db: Firestore,
  id: string,
  carrinhoId: string,
) {
  await deleteDoc(doc(db, "cliente", id, "carrinho", carrinhoId));
}

export async function setEnderecoByIdCliente(
  db: Firestore,
  id: string,
  dt: Endereco
) {
  await addDoc(collection(db, "cliente", id, "endereco"), dt);
}

export async function updateEnderecoByIdCliente(
  db: Firestore,
  id: string,
  enderecoId: string,
  dt: Endereco
) {
  await updateDoc(doc(db, "cliente", id, "endereco", enderecoId), dt);
}

export async function deleteEnderecoByIdCliente(
  db: Firestore,
  id: string,
  enderecoId: string
) {
  await deleteDoc(doc(db, "cliente", id, "carrinho", enderecoId));
}
