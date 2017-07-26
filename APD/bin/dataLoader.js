var noble = require('noble');
var fs = require('fs');

console.log('data Loading..');
noble.on('scanStart', () => {
});

noble.on('scanStop', () => {
});

noble.on('stateChange', function (state) {
    if (state === 'poweredOn') {
        noble.startScanning(['fff0'], false);
    } else {
        noble.stopScanning();
    }
});

noble.on('discover', (peripheral) => {
console.log(peripheral);
    peripheral.connect((error) => {
console.log('connected');

        peripheral.discoverSomeServicesAndCharacteristics(["fff0"], ["fff1"], (error, services, characteristics) => {
            console.log('find');

            characteristics[0].subscribe();
            characteristics[0].read();
            characteristics[0].on('data', (data, isNotification) => {
                console.log(data.toString('utf8'));
            });
        });

        setTimeout(function () {
            peripheral.disconnect();
            process.exit(0);
        }, 1000);
    });

});