/* eslint-disable @typescript-eslint/no-explicit-any */
import { doc, Firestore, setDoc } from "firebase/firestore";

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
