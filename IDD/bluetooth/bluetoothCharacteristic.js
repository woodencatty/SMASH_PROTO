var util = require('util');
var bleno = require('bleno');
var bluetooth = require('./bluetooth');

function bluetoothCharacteristic(bluetooth) {
  bleno.Characteristic.call(this, {
    uuid: '00110001',
    properties: ['read', 'write'],
    descriptors: [
      new bleno.Descriptor({
        uuid: '2901',
        value: 'Specify Patient'
      })
    ]
  });

  this.bluetooth = bluetooth;
}

util.inherits(bluetoothCharacteristic, bleno.Characteristic);

bluetoothCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  if (offset) {
    callback(this.RESULT_ATTR_NOT_LONG);
  }
  else if (data.length !== 1) {
    callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
  }
  else {
    var Acceldata = data.readUInt8(0);
        this.bluetooth.Acceldata = Acceldata;
        callback(this.RESULT_SUCCESS);
  }
};

bluetoothCharacteristic.prototype.onReadRequest = function(offset, callback) {
  if (offset) {
    callback(this.RESULT_ATTR_NOT_LONG, null);
  }
  else {
    var data = 100;
    data.writeUInt8(this.bluetooth.Acceldata, 0);
    callback(this.RESULT_SUCCESS, data);
  }
};

module.exports = bluetoothCharacteristic;