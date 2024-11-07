import { useState, useEffect, useCallback } from "react";
import { Firestore } from "firebase/firestore";



export function useQuery<T, F>(
  func: (db: Firestore, filters: F, cb: (e: T) => void) => Promise<void>,
  db: Firestore,
  filter: F
) {
  const [data, setData] = useState<T>();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleError = () => {
    setError(true);
    setLoading(false);
  };

  // this function is calling useCallback to stop an infinite loop since it is in the dependency array of useEffect
  const runQuery = useCallback(() => {
    const handleSuccess = () => {
      setLoading(false);
    };

    setLoading(true);
    func(db, filter, setData).then(handleSuccess).catch(handleError);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    runQuery();
  }, [runQuery]);

  return { data, loading, error, refetch: runQuery };
}
