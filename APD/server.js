const gpio = require('wiring-pi');
const express = require('express');
const app = express();

var sensor = require('./sensor.js')

app.listen(60001, () => {
    gpio.wiringPiSetup();
    gpio.pinMode(ultraTRIG, gpio.OUTPUT);
    gpio.pinMode(ultraECHO, gpio.INPUT);
    gpio.pinMode(shutdownBtn, gpio.INPUT);

    console.log("device enable");
});

app.get('/', (req, res) => {
});

app.get('/audio', (req, res) => {
  sensor.getAdcAudio();
    res.redirect('/');
});

app.get('/env', (req, res) => {
 sensor.getAdcEnv();
     res.redirect('/');

});

app.get('/temp', (req, res) => {
 sensor.getTemp();
    res.redirect('/');

});

app.get('/humi', (req, res) => {
 sensor.getHumi();
     res.redirect('/');

});

app.get('/dist', (req, res) => {
 sensor.getDist();
     res.redirect('/');

});

app.get('/light', (req, res) => {
 sensor.getAdcLight();
     res.redirect('/');

});