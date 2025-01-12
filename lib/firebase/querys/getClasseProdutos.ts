import { ClassesProdutos } from "@/types/produtos";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/lib/firebase/instances";

export async function getClassesRecursos(): Promise<ClassesProdutos[]> {
  const q = query(collection(db, "classesRecursos"));

  const results = await getDocs(q);
  return results.docs.map((doc) => {
    const dt = doc.data();
    return {
      id: doc.id,
      nome: dt.nome,
    };
  });
}
