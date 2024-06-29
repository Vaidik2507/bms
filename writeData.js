// writeData.js
const { InfluxDB, Point } = require('@influxdata/influxdb-client');
const config = require('./config');

const client = new InfluxDB({ url: config.influx.url, token: config.influx.token });
const writeApi = client.getWriteApi(config.influx.org, config.influx.bucket);
writeApi.useDefaultTags({ location: 'sensor1' });

const writeVoltageData = async () => {
  const point = new Point('voltage')
    .tag('sensor', 'voltageSensor')
    .floatField('value', Math.random() * 100); // Simulate voltage data

  writeApi.writePoint(point);
  await writeApi.flush();
  console.log('Voltage data written to InfluxDB');
};

writeVoltageData().then(() => {
  console.log('Data write complete');
  process.exit(0);
}).catch((error) => {
  console.error('Error writing data:', error);
  process.exit(1);
});
