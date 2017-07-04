var sensor = require('./sensor.js')

const gpio = require('wiring-pi');
const express = require('express');
const app = express();

sensor.getTemp();
