import { ClassesProdutos } from "@/types/produtos";
import { collection, Firestore, getDocs, query } from "firebase/firestore";

export async function getClassesRecursos(db: Firestore): Promise<ClassesProdutos[]> {
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
