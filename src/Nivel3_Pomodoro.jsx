import { useState, useEffect, useRef } from 'react';
import './pomodoro.css';

function formatTime(seconds) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

function Pomodoro() {
  const [workMins, setWorkMins] = useState(25);
  const [breakMins, setBreakMins] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('work');
  const [sessions, setSessions] = useState([]);

  const intervalRef = useRef(null);

  const workSecs = workMins * 60;
  const breakSecs = breakMins * 60;
  const totalSecs = mode === 'work' ? workSecs : breakSecs;

  const progress = Math.min(((totalSecs - timeLeft) / totalSecs) * 100, 100);
  const workSessions = sessions.filter(s => s.type === 'work');
  const totalTime = sessions.reduce((acc, s) => acc + s.duration, 0);

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
      try {
        new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play();
      } catch {}

      if (mode === 'work') {
        setSessions(prev => [
          ...prev,
          { id: Date.now(), type: 'work', duration: workSecs, completedAt: new Date() },
        ]);
      }
      const nextMode = mode === 'work' ? 'break' : 'work';
      setMode(nextMode);
      setTimeLeft(nextMode === 'work' ? workSecs : breakSecs);
      setIsRunning(true);
    }
  }, [timeLeft, mode]);

  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(mode === 'work' ? workMins * 60 : breakMins * 60);
    }
  }, [workMins, breakMins]);

  function toggleTimer() {
    setIsRunning(prev => !prev);
  }

  function resetTimer() {
    setIsRunning(false);
    setMode('work');
    setTimeLeft(workMins * 60);
    setSessions([]);
  }

  function savePartial() {
    const elapsed = totalSecs - timeLeft;
    if (elapsed <= 0) return;
    setSessions(prev => [
      ...prev,
      { id: Date.now(), type: 'work (parcial)', duration: elapsed, completedAt: new Date() },
    ]);
  }

  return (
    <div className="page">
      <div className="card">
        <span className="badge">Nivel 3</span>

        <div className="config-row">
          <label className="config-label">
            Trabajo (min)
            <input
              type="number"
              min="1"
              max="60"
              value={workMins}
              disabled={isRunning}
              onChange={e => setWorkMins(Math.max(1, Math.min(60, Number(e.target.value))))}
              className="config-input"
            />
          </label>
          <label className="config-label">
            Descanso (min)
            <input
              type="number"
              min="1"
              max="60"
              value={breakMins}
              disabled={isRunning}
              onChange={e => setBreakMins(Math.max(1, Math.min(60, Number(e.target.value))))}
              className="config-input"
            />
          </label>
        </div>

        <div className={`mode-pill ${mode === 'work' ? 'mode-work' : 'mode-break'}`}>
          {mode === 'work' ? 'Trabajo' : 'Descanso'}
        </div>

        <p className="clock">{formatTime(timeLeft)}</p>

        <div className="progress-bg">
          <div
            className={`progress-fill ${mode === 'work' ? 'progress-work' : 'progress-break'}`}
            style={{ width: `${progress}%` }}
          />
        </div>

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
          <button className="btn btn-save" onClick={savePartial} disabled={!isRunning}>
            Guardar parcial
          </button>
        </div>

        <div className="stats-row">
          <div className="stat-box">
            <span className="stat-val">{workSessions.length}</span>
            <span className="stat-label">Sesiones</span>
          </div>
          <div className="stat-box">
            <span className="stat-val green">{formatTime(totalTime)}</span>
            <span className="stat-label">Tiempo total</span>
          </div>
        </div>

        {sessions.length > 0 && (
          <div className="session-list">
            <p className="session-title">Historial</p>
            {sessions.map((s, i) => (
              <div key={s.id} className={`session-row ${s.type.includes('parcial') ? 'partial' : ''}`}>
                <span className="session-num">#{i + 1}</span>
                <span className="session-type">{s.type}</span>
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
