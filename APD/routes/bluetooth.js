var noble = require('noble');

let try_count = 0;
let ID;


noble.on('scanStart', () => {
    console.log('status : scanning');
});

noble.on('scanStop', () => {
    console.log('status : scan stop');
});

module.exports = {
    startScanning: () => {
       
                noble.startScanning(['fff0'], false);

        noble.on('discover', (peripheral) => {
            console.log('find : ' + peripheral.advertisement.localName + "(" + peripheral.address + ")");
            ID = peripheral.advertisement.localName;
             noble.stopScanning();
        });
    },

    getTryCount: (callback) => {
        callback(try_count);
    },
    getIDDData: (callback) => {
        console.log(ID);
        callback(ID);

    }
}