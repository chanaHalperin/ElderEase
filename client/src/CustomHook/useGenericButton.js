import { useState } from 'react';

export function useGenericButton(action) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await action(); // מפעיל את הפונקציה שקיבלת
    } catch (err) {
      console.error('שגיאה בביצוע הפעולה:', err);
    } finally {
      setLoading(false);
    }
  };

  return { handleClick, loading };
}
