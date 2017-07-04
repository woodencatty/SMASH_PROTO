var util = require('util');
var bleno = require('bleno');

var bluetoothCharacteristic = require('./bluetoothCharacteristic');

function BluetoothService(bluetooth) {
    bleno.PrimaryService.call(this, {
        uuid: '0011',
        characteristics: [
            new bluetoothCharacteristic(bluetooth)
        ]
    });
}

util.inherits(BluetoothService, bleno.PrimaryService);

module.exports = BluetoothService;