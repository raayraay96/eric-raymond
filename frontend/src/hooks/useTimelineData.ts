// src/hooks/useTimelineData.ts
import { useEffect, useState } from 'react';
import type { TimelineItem } from '../types/TimelineType';

const useTimelineData = () => {
  const [data, setData] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    fetch('/api/timeline')
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
};

export default useTimelineData;
