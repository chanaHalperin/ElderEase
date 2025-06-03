// import { useEffect, useState } from "react";
// import { getEnum } from "./enumsService";

// export function useEnum(enumName) {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(!data);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     let isMounted = true;

//     getEnum(enumName)
//       .then((enumData) => {
//         if (isMounted) {
//           setData(enumData);
//           setLoading(false);
//         }
//       })
//       .catch((err) => {
//         if (isMounted) {
//           setError(err);
//           setLoading(false);
//         }
//       });

//     return () => {
//       isMounted = false;
//     };
//   }, [enumName]);

//   return { data, loading, error };
// }

// export default useEnum;




import { useQuery } from "@tanstack/react-query";
import { getEnum } from "./enumsService";

export function useEnum(enumName) {
  return useQuery({
    queryKey: ["enum", enumName],
    queryFn: () => getEnum(enumName),
    enabled: !!enumName, // ירוץ רק אם יש enumName
    staleTime: 1000 * 60 * 10, // עשר דקות טריות
    retry: 1, // נסיון אחד נוסף במקרה של שגיאה
  });
}

export default useEnum;
