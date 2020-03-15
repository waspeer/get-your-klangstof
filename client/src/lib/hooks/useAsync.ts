import { useCallback, useState } from 'react';

const useAsync = <T>(asyncFunction: () => Promise<T>) => {
  const [pending, setPending] = useState(false);
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<any>(null);

  const execute = useCallback(() => {
    setPending(true);
    setValue(null);
    setError(null);
    return asyncFunction()
      .then((response) => setValue(response))
      .catch((e) => setError(e))
      .finally(() => setPending(false));
  }, [asyncFunction]);

  return { execute, pending, value, error };
};

export default useAsync;
