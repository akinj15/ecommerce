/* eslint-disable @typescript-eslint/no-explicit-any */
import { doc, Firestore, setDoc } from "firebase/firestore";


export async function setClienteById(
  db: Firestore,
  id: string,
  dt: any
) {
  await setDoc(doc(db, "cliente", id), dt);
}
