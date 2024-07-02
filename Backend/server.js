const express = require('express');
const path = require('path');
const Influx = require('influx');
const config = require('./config');
const WebSocket = require('ws');

const app = express();
const port = 3000;

// InfluxDB client setup
const influx = new Influx.InfluxDB({
  host: config.influx.host,
  port: config.influx.port,
  database: config.influx.database,
  username: config.influx.username,
  password: config.influx.password,
});

// API routes
app.use('/api', require('./routes/api'));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Catchall handler: send back React's index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');

  const sendVoltageData = async () => {
    const query = `SELECT * FROM "${config.influx.database}"."autogen"."mV" WHERE time > now() - 1h AND "entity_id" =~ /esp_power_sensor_ina260_voltage_/`;

    try {
      const data = await influx.query(query);
      const batteryData = data.reduce((acc, row) => {
        const id = row.entity_id.split('_').pop();
        if (!acc[id]) {
          acc[id] = [];
        }
        acc[id].push({ time: row.time, value: row.value });
        return acc;
      }, {});

      ws.send(JSON.stringify(batteryData));
    } catch (error) {
      console.error('Error querying InfluxDB:', error);
    }
  };





  
  // Send data initially
  sendVoltageData();

  // Set up interval to send data every 5 seconds
  const interval = setInterval(sendVoltageData, 5000);

  ws.on('close', () => {
    clearInterval(interval);
    console.log('Client disconnected');
  });
});
