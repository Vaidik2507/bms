import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const BatteryDetail = () => {
  const { entity_id } = useParams();
  const [batteryDetails, setBatteryDetails] = useState(null);

  useEffect(() => {
    const fetchBatteryDetails = async () => {
      try {
        const response = await fetch(`/api/voltage/${entity_id}`);
        const data = await response.json();
        setBatteryDetails(data);
      } catch (error) {
        console.error('Error fetching battery details:', error);
      }
    };

    fetchBatteryDetails();
  }, [entity_id]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data[entity_id]) {
        const latestData = data[entity_id][data[entity_id].length - 1];
        setBatteryDetails(latestData);
      }
    };

    return () => {
      ws.close();
    };
  }, [entity_id]);

  if (!batteryDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="BatteryDetail">
      <h2>Battery Detail for Battery {entity_id}</h2>
      <div>
        Voltage: {batteryDetails.value} V
      </div>
      <div>
        Time: {batteryDetails.time}
      </div>
      <Link to="/">
        <button className="Button">Back to Main Page</button>
      </Link>
    </div>
  );
};

export default BatteryDetail;
