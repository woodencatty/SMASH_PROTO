var sensor = require('./sensor.js')

const gpio = require('wiring-pi');
const express = require('express');
const app = express();


app.listen(60001, () => {
    console.log("device enable");
});

app.get('/', (req, res) => {
});

app.get('/audio', (req, res) => {
  sensor.getAdcAudio();
});


app.get('/env', (req, res) => {
 sensor.getAdcEnv();
});

app.get('/temp', (req, res) => {
  res.send(123);

});

app.get('/humi', (req, res) => {
 sensor.getHumi();

});

app.get('/dist', (req, res) => {
 sensor.getDist();

});

app.get('/light', (req, res) => {
 sensor.getAdcLight();

});