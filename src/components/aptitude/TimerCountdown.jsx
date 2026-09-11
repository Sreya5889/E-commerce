import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

export const TimerCountdown = ({
  durationMinutes = 15,
  initialSeconds = null,
  onTimeUp,
  onTick
}) => {
  const totalSeconds = initialSeconds !== null ? initialSeconds : durationMinutes * 60;
  const [secondsRemaining, setSecondsRemaining] = useState(totalSeconds);

  useEffect(() => {
    setSecondsRemaining(totalSeconds);
  }, [totalSeconds]);

  useEffect(() => {
    if (secondsRemaining <= 0) {
      onTimeUp?.();
      return;
    }

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        const next = Math.max(0, prev - 1);
        onTick?.(next);
        if (next === 0) {
          clearInterval(interval);
          onTimeUp?.();
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsRemaining, onTimeUp, onTick]);

  const hours = Math.floor(secondsRemaining / 3600);
  const minutes = Math.floor((secondsRemaining % 3600) / 60);
  const seconds = secondsRemaining % 60;

  const formattedTime = hours > 0
    ? `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isCritical = secondsRemaining <= 60;
  const isWarning = secondsRemaining <= 300 && !isCritical;

  let timerStyles = 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700';
  if (isCritical) {
    timerStyles = 'bg-rose-500/15 text-rose-600 border-rose-500/30 animate-pulse dark:text-rose-400';
  } else if (isWarning) {
    timerStyles = 'bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400';
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border font-mono font-bold text-sm tracking-wider shadow-sm transition-all ${timerStyles}`}>
      {isCritical ? (
        <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
      ) : (
        <Clock className="w-4 h-4" />
      )}
      <span>{formattedTime}</span>
      {isCritical && <span className="text-[10px] font-sans uppercase font-bold tracking-normal">Ending</span>}
    </div>
  );
};
