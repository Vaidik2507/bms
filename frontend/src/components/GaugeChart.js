// src/components/GaugeChart.js
import React from 'react';
import GaugeChart from 'react-gauge-chart';

const GaugeChartComponent = ({ value, needleColor, textColor }) => {
  return (
    <GaugeChart
      id="gauge-chart"
      nrOfLevels={30}
      percent={value / 100}
      needleColor={needleColor}
      textColor={textColor}
    />
  );
};

export default GaugeChartComponent;
