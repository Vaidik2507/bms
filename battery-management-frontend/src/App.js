import React, { useState, useEffect } from 'react';
import VoltageGauge from './components/VoltageGauge';
import './App.css';

const App = () => {
  const [voltage, setVoltage] = useState(0);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.voltage !== undefined) {
        setVoltage(data.voltage);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Battery Management System</h1>
        <VoltageGauge value={voltage} />
      </header>
    </div>
  );
};

export default App;
