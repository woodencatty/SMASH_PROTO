const gpio = require('wiring-pi');
const express = require('express');
const app = express();

var sensor = require('./sensor.js')



app.listen(60001, () => {
    console.log("device enable");
    
sensor.getTemp();
sensor.getHumi();
sensor.getDist();
sensor.getAdcAudio();
sensor.getAdcEnv();
sensor.getAdcLight();
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
 sensor.getTemp();
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