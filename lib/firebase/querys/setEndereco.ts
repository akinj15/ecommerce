/* eslint-disable @typescript-eslint/no-explicit-any */
import { createUuid } from "@/lib/format";
import { Endereco } from "@/types/endereco";
import { doc, Firestore, setDoc } from "firebase/firestore";


export async function setEndereco(
  db: Firestore,
  userId: string,
  id: string,
  dt: Endereco
) {
  await setDoc(doc(db, "cliente", userId, "endereco", id || createUuid()), dt);
}
