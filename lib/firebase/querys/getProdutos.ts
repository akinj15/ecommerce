import { collection, Firestore, getDocs, Query, query, where } from "firebase/firestore";

function applyQueryFilters(q: Query, { classe }: { classe: string }) {
  if (classe) {
    q = query(q, where("classe", "==", classe));
  }
  return q;
}

export async function getRestaurants(db: Firestore, filters: { classe: string }) {
  let q = query(collection(db, "restaurants"));

  q = applyQueryFilters(q, filters);
  const results = await getDocs(q);
  return results.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
      // Only plain objects can be passed to Client Components from Server Components
      timestamp: doc.data().timestamp.toDate(),
    };
  });
}
