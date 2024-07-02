import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import BatteryCard from './components/BatteryCard';
import BatteryDetail from './components/BatteryDetail';
import { Grid, Container, Button } from '@mui/material';
import './App.css';

const generateBatteryData = (count) => {
  return Array.from({ length: count }, (v, i) => ({
    id: i + 1,
    entity_id: `esp_power_sensor_ina260_voltage_${i + 1}`,
    voltage: (Math.random() * 12).toFixed(2),
    current: (Math.random() * 5).toFixed(2),
    power: (Math.random() * 60).toFixed(2),
  }));
};

const batteryData = generateBatteryData(4);
const batteryData12 = generateBatteryData(12);


const App = () => {
  return (
    <Router>
      <Container className="container">
        <Routes>
          
          <Route path="/" element={
            <>
              <header className="App-header">
                <h1>Battery Management System</h1>
                <Button variant="contained" color="primary" component={Link} to="/batteries">
                  Show All Batteries
                </Button>
              </header>
              <Grid container spacing={2} className="grid-container">
                {batteryData.map(battery => (
                  <Grid item key={battery.id} xs={12} sm={6} md={4} lg={3} className="grid-item">
                    <BatteryCard
                      id={battery.id}
                      entity_id={battery.entity_id}
                      voltage={battery.voltage}
                      current={battery.current}
                      power={battery.power}
                    />
                  </Grid>
                ))}
              </Grid>
            </>
          } />
          <Route path="/batteries" element={
            <>
              <header className="App-header">
                <h1>All Batteries</h1>
                <Button variant="contained" color="primary" component={Link} to="/">
                  Back to Main Page
                </Button>
              </header>
              <Grid container spacing={2} className="grid-container">
                {batteryData12.map(battery => (
                  <Grid item key={battery.id} xs={12} sm={6} md={4} lg={3} className="grid-item">
                    <BatteryCard
                      id={battery.id}
                      entity_id={battery.entity_id}
                      voltage={battery.voltage}
                      current={battery.current}
                      power={battery.power}
                    />
                  </Grid>
                ))}
              </Grid>
            </>
          } />
          <Route path="/battery/:entity_id" element={<BatteryDetail />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
