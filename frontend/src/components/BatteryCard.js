import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Gauge from './GaugeChart';
import './BatteryCard.css';

const BatteryCard = ({ id, entity_id, voltage, current, power }) => {
  const [voltagePercentage, setVoltagePercentage] = useState((voltage / 12) * 100);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000');
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data[entity_id]) {
        const latestData = data[entity_id][data[entity_id].length - 1];
        setVoltagePercentage((latestData.value / 12) * 100);
      }
    };

    return () => {
      ws.close();
    };
  }, [entity_id]);

  return (
    <div className="BatteryCard">
      <h3>Battery {id}</h3>
      <div className="gauge">
        <Gauge needleColor="#FFA500" textColor="#FFA500" value={voltagePercentage} />
      </div>
      <div>
        Voltage: {voltage}V
      </div>
      <div>
        Current: {current}A
      </div>
      <div>
        Power: {power}W
      </div>
      <Link to={`/battery/${entity_id}`}>
        <button className="Button">View Details</button>
      </Link>
    </div>
  );
};

export default BatteryCard;
