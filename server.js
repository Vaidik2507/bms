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

// Endpoint to fetch voltage data
app.get('/api/voltage', async (req, res) => {
  const query = `SELECT * FROM "${config.influx.database}"."autogen"."mV" WHERE time > now() - 1h AND "entity_id" = 'esp_power_sensor_ina260_voltage'`;

  try {
    const data = await influx.query(query);
    console.log(data);
    const response = data.map(row => ({
      time: row.time,
      value: row.value,
    }));
    res.json(response);
  } catch (error) {
    console.error('Error querying InfluxDB:', error);
    res.status(500).send('Error querying InfluxDB');
  }
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// The "catchall" handler: for any request that doesn't match the above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// WebSocket setup
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');

  const sendVoltageData = async () => {
    const query = `SELECT * FROM "${config.influx.database}"."autogen"."mV" WHERE time > now() - 1h AND "entity_id" = 'esp_power_sensor_ina260_voltage'`;
    
    try {
      const data = await influx.query(query);
      console.log(data.length)
      if (data.length > 0) {
        ws.send(JSON.stringify({ voltage: data[data.length - 1].value }));
      }
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
