var noble = require('noble');

noble.on('scanStart', () => {
    console.log('status : scanning');
});

noble.on('scanStop', () => {
    console.log('status : scan stop');
});

noble.on('stateChange', function (state) {
    if (state === 'poweredOn') {
        noble.startScanning(['fff0'], true);
    } else {
        noble.stopScanning();
    }
});

noble.on('discover', (peripheral) => {
    console.log('find : ' + peripheral.advertisement.localName + "(" + peripheral.address + ")");
  
        peripheral.connect((error) => {
            peripheral.updateRssi((error, rssi) => {
                console.log('rssi : ' + rssi);
            });
peripheral.discoverSomeServicesAndCharacteristics(["fff0"], ["fff1"], (error, services, characteristics)=>{
    console.log('discovered');
console.log(services);
console.log(characteristics);
                    console.log('error : '+ error);
                characteristics[0].subscribe();
                characteristics[0].read();

                characteristics[0].on('data', (data, isNotification)=>{
                    console.log('data : '+ data.toString('utf8'));
                });
                });

               
            });
        });