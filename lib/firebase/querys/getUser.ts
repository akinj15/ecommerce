/* eslint-disable @typescript-eslint/no-explicit-any */
import { doc, Firestore, getDoc } from "firebase/firestore";


export async function getClientes(
  db: Firestore,
  filters: { id: string },
  cb: (e: any) => void,
  is: (e: boolean) => void
) {
  const docRef = doc(db, "cliente", filters.id);
  const docSnap = await getDoc(docRef);
  try {
    if (docSnap.exists()) {
      const dt = docSnap.data();
      cb(dt);
    }
  } finally {
    is(false);
  }
}

export async function getClienteById(
  db: Firestore,
  filters: { id: string },
  cb: (e: any) => void,
) {
  console.log(filters)
  const docRef = doc(db, "cliente", filters.id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const dt = docSnap.data();
    cb(dt);
  }
}