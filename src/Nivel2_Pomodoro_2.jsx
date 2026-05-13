import { useState, useEffect, useRef } from 'react';
import './pomodoro.css';

const WORK_TIME = 1500;
const BREAK_TIME = 300;

function formatTime(seconds) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

function Pomodoro() {
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('work');
  const [sessions, setSessions] = useState([]);

  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      if (mode === 'work') {
        setSessions(prev => [
          ...prev,
          { id: Date.now(), type: 'work', duration: WORK_TIME, completedAt: new Date() },
        ]);
      }
      const nextMode = mode === 'work' ? 'break' : 'work';
      setMode(nextMode);
      setTimeLeft(nextMode === 'work' ? WORK_TIME : BREAK_TIME);
      setIsRunning(true);
    }
  }, [timeLeft, mode]);

  function toggleTimer() {
    setIsRunning(prev => !prev);
  }

  function resetTimer() {
    setIsRunning(false);
    setTimeLeft(WORK_TIME);
    setMode('work');
    setSessions([]);
  }

  return (
    <div className="page">
      <div className="card">
        <span className="badge">Nivel 2</span>

        <div className={`mode-pill ${mode === 'work' ? 'mode-work' : 'mode-break'}`}>
          {mode === 'work' ? 'Trabajo' : 'Descanso'}
        </div>

        <p className="clock">{formatTime(timeLeft)}</p>

        <div className="btn-row">
          <button
            className={`btn ${isRunning ? 'btn-pause' : 'btn-start'}`}
            onClick={toggleTimer}
          >
            {isRunning ? 'Pausar' : 'Iniciar'}
          </button>
          <button className="btn btn-reset" onClick={resetTimer}>
            Reiniciar
          </button>
        </div>

        {sessions.length > 0 && (
          <div className="session-list">
            <p className="session-title">Sesiones completadas</p>
            {sessions.map((s, i) => (
              <div key={s.id} className="session-row">
                <span className="session-num">#{i + 1}</span>
                <span className="session-type">Trabajo</span>
                <span className="session-dur">{formatTime(s.duration)}</span>
                <span className="session-time">{s.completedAt.toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Pomodoro;
