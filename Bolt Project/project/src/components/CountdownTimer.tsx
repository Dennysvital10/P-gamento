import React, { useState, useEffect } from 'react';

type CountdownTimerProps = {
  initialMinutes: number;
  initialSeconds: number;
  onTimeout?: () => void;
  className?: string;
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialMinutes = 10,
  initialSeconds = 0,
  onTimeout,
  className = '',
}) => {
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isExpiring, setIsExpiring] = useState(false);

  useEffect(() => {
    const countdown = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (minutes > 0) {
        setMinutes(minutes - 1);
        setSeconds(59);
      } else {
        clearInterval(countdown);
        onTimeout && onTimeout();
      }

      // Set expiring state when less than 2 minutes remain
      if (minutes === 1 && seconds === 59) {
        setIsExpiring(true);
      }
    }, 1000);

    return () => clearInterval(countdown);
  }, [minutes, seconds, onTimeout]);

  // Format time to always display two digits
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  return (
    <div 
      className={`font-mono text-center ${isExpiring ? 'text-red-500' : 'text-white'} transition-colors duration-500 ${className}`}
    >
      <div className="text-lg font-medium opacity-70 mb-1">Tempo restante para pagamento</div>
      <div className="text-4xl font-bold tracking-wider">
        {formattedMinutes}:{formattedSeconds}
      </div>
    </div>
  );
};

export default CountdownTimer;