// ============================================================================
// MES Plastico — useElapsedTime Hook
// ============================================================================

import { useState, useEffect, useRef } from 'react';

/**
 * Returns a formatted elapsed time string that updates every second.
 * Accepts a start timestamp (ISO string or Date-parseable string).
 * Returns "Xh Ym Zs" format.
 */
export function useElapsedTime(startTimestamp: string | null): string {
  const [elapsed, setElapsed] = useState('0s');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!startTimestamp) {
      setElapsed('0s');
      return;
    }

    const startMs = new Date(startTimestamp).getTime();

    const update = () => {
      const now = Date.now();
      const diffMs = Math.max(0, now - startMs);
      const totalSeconds = Math.floor(diffMs / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      if (hours > 0) {
        setElapsed(`${hours}h ${minutes}m ${seconds}s`);
      } else if (minutes > 0) {
        setElapsed(`${minutes}m ${seconds}s`);
      } else {
        setElapsed(`${seconds}s`);
      }
    };

    update();
    intervalRef.current = setInterval(update, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startTimestamp]);

  return elapsed;
}
