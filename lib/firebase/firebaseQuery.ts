import { useState, useEffect, useCallback } from "react";

export function useQuery<T>(
  func: () => Promise<T>,
  onSuccess?: () => void,
  onError?: () => void
) {
  const [data, setData] = useState<T>();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleError = () => {
    setError(true);
    if (onError) onError();
    setLoading(false);
  };

  // this function is calling useCallback to stop an infinite loop since it is in the dependency array of useEffect
  const runQuery = useCallback(() => {
    const handleSuccess = (res: T) => {
      setData(res);
    if (onSuccess) onSuccess();
      setLoading(false);
    };

    setLoading(true);
    func().then(handleSuccess).catch(handleError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    runQuery();
  }, [runQuery]);

  return { data, loading, error, refetch: runQuery };
}
