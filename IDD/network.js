const BluetoothSerialPort = require('bluetooth-serial-port');

const rfcomm = new BluetoothSerialPort.BluetoothSerialPort();

rfcomm.on('found', function (address, name) {
	console.log('found device:', name, 'with address:', address);

    if(name == 'raspberrypi'){
        rfcomm.connect(address, 10, function(){
            console.log('connection success');
        });
        rfcomm.close();
        console.log('connection close');
    }
});

rfcomm.on('finished', function () {
  console.log('inquiry finished');
});

console.log('start inquiry');
rfcomm.inquire();
console.log('should be displayed before the end of inquiry');