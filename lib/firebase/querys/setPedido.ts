/* eslint-disable @typescript-eslint/no-explicit-any */
import { NovoPedido } from "@/types/pedido";
import { addDoc, collection, Firestore, } from "firebase/firestore";


export async function setPedidoByIdCliente(
  db: Firestore,
  id: string,
  dt: NovoPedido
) {
  await addDoc(collection(db, "cliente", id, "pedido"), dt);
}
