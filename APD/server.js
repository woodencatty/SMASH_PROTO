var sensor = require('./sensor.js')

const gpio = require('wiring-pi');
const express = require('express');
const app = express();



setTimeout(function(){
  sensor.getTemp();
}, 2000);
