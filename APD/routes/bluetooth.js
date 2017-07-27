var noble = require('noble');
require('date-utils');

let try_count = 0;
let ID = 'noname';


let steps = 0;
let step_date;


noble.on('scanStart', () => {
    console.log('status : scanning');
});

noble.on('scanStop', () => {
    console.log('status : scan stop');
});

module.exports = {
    startScanning: () => {
        try_count++;
        noble.startScanning(['fff0'], false);
        noble.on('discover', (peripheral) => {
            console.log('find : ' + peripheral.advertisement.localName + "(" + peripheral.address + ")");
            ID = peripheral.advertisement.localName;
            peripheral.connect((error) => {
                peripheral.discoverSomeServicesAndCharacteristics(['fff0'], ['fff1'], (error, services, characteristics) => {
                    characteristics[0].subscribe();
                    characteristics[0].read();
                    characteristics[0].on('data', (data, isNotification) => {
                        let data_array = data.split(',');
                        steps = data_array[0];
                        step_date = new Date(data_array[1], data_array[2], data_array[3], data_array[4], data_array[5], data_array[6], 0);
                    });
                });
            });
            setTimeout(() => {
                peripheral.disconnect
            }, 2000);

        });
    },

    getTryCount: (callback) => {
        callback(try_count);
    },

    getIDDData: (callback) => {
        console.log(ID);
        console.log(steps);
        console.log(step_date);
        callback(ID, steps, step_date);
    }
}