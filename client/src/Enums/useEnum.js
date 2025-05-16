import { useEffect, useState } from "react";
import { getEnum } from "./enumsService";

export function useEnum(enumName) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    getEnum(enumName)
      .then((enumData) => {
        if (isMounted) {
          setData(enumData);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [enumName]);

  return { data, loading, error };
}

export default useEnum;