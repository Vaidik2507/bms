const express = require('express');
const router = express.Router();
const Influx = require('influx');
const config = require('../config');

// InfluxDB client setup
const influx = new Influx.InfluxDB({
  host: config.influx.host,
  port: config.influx.port,
  database: config.influx.database,
  username: config.influx.username,
  password: config.influx.password,
});

// Endpoint to fetch voltage data for a specific battery
router.get('/voltage/:entity_id', async (req, res) => {
  const { entity_id } = req.params;
  const query = `SELECT * FROM "${config.influx.database}"."autogen"."mV" WHERE time > now() - 1h AND "entity_id" = '${entity_id}'`;

  try {
    const data = await influx.query(query);
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

module.exports = router;
