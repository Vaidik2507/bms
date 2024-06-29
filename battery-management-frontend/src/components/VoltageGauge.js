import React from 'react';
import GaugeChart from 'react-gauge-chart';

const VoltageGauge = ({ value }) => {
  return (
    <div>
      <h3>Voltage</h3>
      <GaugeChart 
        id="voltage-gauge"
        nrOfLevels={20}
        percent={value / 100} 
        formatTextValue={(value) => `${value}V`}
      />
    </div>
  );
};

export default VoltageGauge;
