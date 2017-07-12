var bleno = require('bleno');
var util = require('util');

var Move = require('./calculator.js');

var Value;

function IDDService() {
    bleno.PrimaryService.call(this, {
        uuid: '13333333333333333333333333333337',
        characteristics: [
            new IDDCharacteristic()
        ]
    });
}

util.inherits(IDDService, bleno.PrimaryService);

function IDDCharacteristic() {
  bleno.Characteristic.call(this, {
    uuid: '13333333333333333333333333330001',
    properties: ['notify', 'read'],
    descriptors: [
      new bleno.Descriptor({
        uuid: '2901',
        value: 'IDD Devices'
      })
    ]
  });
}

util.inherits(IDDCharacteristic, bleno.Characteristic);


var name = 'IDD';
var Service = new IDDService();



IDDCharacteristic.prototype.onSubscribe = function (maxValueSize, updateValueCallback) {
  console.log('IDDCharacteristic subscribe');
setTimeout(function(){
 this.SubsInterval = setInterval(function () {

       MoveCallback = function (MoveValue) {
      Value = MoveValue;
    }

    Move.getMoveValue(MoveCallback)

    var data = new Buffer(4);

    data.writeUInt8(Value, 0);

    console.log('IDDCharacteristic update value: ' + Value);
    updateValueCallback(data);

  }.bind(this), 500);
}, 2000);
};

IDDCharacteristic.prototype.onUnsubscribe = function () {
  console.log('IDDCharacteristic unsubscribe');

  if (this.ValueInterval) {
    clearInterval(this.ValueInterval);
    this.ValueInterval = null;
  }

    if (this.SubsInterval) {
    clearInterval(this.SubsInterval);
    this.SubsInterval = null;
  }
};

IDDCharacteristic.prototype.onReadRequest = function (offset, callback) {

   MoveCallback = function (MoveValue) {
      Value = MoveValue;
    }

    Move.getMoveValue(MoveCallback)

  Value = 10;
  var data = new Buffer(4);
  data.writeUInt8(Value, 0);

  callback(Characteristic.RESULT_SUCCESS, Value);
};

bleno.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    //
    // We will also advertise the service ID in the advertising packet,
    // so it's easier to find.
    //
    bleno.startAdvertising(name, [Service.uuid], function(err) {
      if (err) {
        console.log(err);
      }
    });
  }
  else {
    bleno.stopAdvertising();
  }
});
 

bleno.on('advertisingStart', function(err) {
  if (!err) {
    console.log('advertising...');
    //
    // Once we are advertising, it's time to set up our services,
    // along with our characteristics.
    //
    bleno.setServices([
      Service
    ]);
  }
});