import { useState, useEffect, useRef } from 'react';

const WORK_TIME = 1500; // 25 minutos en segundos

function formatTime(seconds) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

function Pomodoro() {
  // TODO 1: estados
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);

  // TODO 2: ref para el intervalo
  const intervalRef = useRef(null);

  // TODO 3: useEffect para el timer
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  function toggleTimer() {
    setIsRunning(prev => !prev);
  }

  function resetTimer() {
    setIsRunning(false);
    setTimeLeft(WORK_TIME);
  }

  return (
    <div>
      <p>{formatTime(timeLeft)}</p>
      <button onClick={toggleTimer}>
        {isRunning ? 'Pausar' : 'Iniciar'}
      </button>
      <button onClick={resetTimer}>Reiniciar</button>
    </div>
  );
}

export default Pomodoro;
