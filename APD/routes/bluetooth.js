const noble = require('noble');

let try_count = 0;
let steps_data;
let ID;

noble.on('scanStart', () => {
    console.log('status : scanning');
});

noble.on('scanStop', () => {
    console.log('status : scan stop');
});

module.exports = {
    startScanning: () => {
        noble.state = 'poweredOn';
        noble.startScanning(['fff0'], true);


        noble.on('discover', (peripheral) => {
            console.log('find : ' + peripheral.advertisement.localName + "(" + peripheral.address + ")");
                ID = peripheral.advertisement.localName;
            peripheral.connect((error) => {
                peripheral.updateRssi((error, rssi) => {
                    console.log('rssi : ' + rssi);
                });
                peripheral.discoverSomeServicesAndCharacteristics(["fff0"], ["fff1"], (error, services, characteristics) => {
                    console.log('discovered');
                    console.log(services);
                    console.log(characteristics);
                    console.log('error : ' + error);
                    characteristics[0].subscribe();
                    characteristics[0].read();

                    characteristics[0].on('data', (data, isNotification) => {
                        console.log('data : ' + data.toString('utf8'));
                        Steps_data = data.toString('utf8');
                    });
                });


            });
        });
   },
    getTryCount: (callback) => {
        callback(try_count);
    },
    getIDDData:(callback) => {
        callback(ID, steps_data);
    }
}