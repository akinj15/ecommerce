// import { Endereco } from "@/types/endereco";
// import { collection, Firestore, getDocs, query } from "firebase/firestore";

// export async function getEnderecosByUser(
//   db: Firestore,
//   id: string,
//   cb: (e: Endereco[]) => void
// ) {
//   const q = query(collection(db, "cliente", id, "endereco"));

//   const results = await getDocs(q);
//   console.log(results.docs);

//   const res = results.docs.map((doc) => {
//     console.log(doc.data());
//     const e = doc.data();
//     return {
//       id: doc.id,
//       bairro: e.bairro,
//       rua: e.rua,
//       numero: e.numero,
//       cidade: e.cidade,
//       cep: e.cep,
//       estado: e.estado,
//       complemento: e.complemento,
//     };
//   });

//   cb(res);
// }
