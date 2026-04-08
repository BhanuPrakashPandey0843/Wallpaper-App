import { useEffect, useRef, useState } from 'react';

interface Params {
  durationSeconds: number;
  /** When false, timer is frozen */
  running: boolean;
  /** Change to reset countdown (e.g. new question index) */
  resetToken: number;
  onExpire: () => void;
}

/**
 * Stable interval: avoids stale closures and re-creating timers on every tick.
 */
export function useQuizTimer({ durationSeconds, running, resetToken, onExpire }: Params): number {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    setTimeLeft(durationSeconds);
  }, [durationSeconds, resetToken]);

  useEffect(() => {
    if (!running) return;
    setTimeLeft(durationSeconds);
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id);
          onExpireRef.current();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, durationSeconds, resetToken]);

  return timeLeft;
}
