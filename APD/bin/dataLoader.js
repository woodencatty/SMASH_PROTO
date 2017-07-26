var noble = require('noble');
var fs = require('fs');


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

    peripheral.connect((error) => {

        peripheral.discoverSomeServicesAndCharacteristics(["fff0"], ["fff1"], (error, services, characteristics) => {
            characteristics[0].subscribe();
            characteristics[0].read();
            characteristics[0].on('data', (data, isNotification) => {
                console.log(data.toString('utf8'));
            });
        });

        setTimeout(function () {
            peripheral.disconnect();
            process.exit(0);
        }, 3000);
    });

});