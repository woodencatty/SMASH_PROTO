var noble = require('noble');

let try_count = 0;
let ID = 'noname';
let step_data;

noble.on('scanStart', () => {
    console.log('status : scanning');
});

noble.on('scanStop', () => {
    console.log('status : scan stop');
});

module.exports = {
    startScanning: () => {
       try_count ++;
                noble.startScanning(['fff0'], false);

        noble.on('discover', (peripheral) => {
            console.log('find : ' + peripheral.advertisement.localName + "(" + peripheral.address + ")");
            

    peripheral.connect((error) => { 

this.fuckInterval = setInterval(() => {
        peripheral.discoverSomeServicesAndCharacteristics(['fff0'], ['fff1'], (error, services, characteristics) => {

            characteristics[0].subscribe();
            characteristics[0].read();
            characteristics[0].on('data', (data, isNotification) => {
                ID = peripheral.advertisement.localName;
                step_data = data.toString('utf8');
            });
        });
        
  }, 5000);  //값 확인을 위해 간격 짧게 잡음.
});

        });
    },

    getTryCount: (callback) => {
        callback(try_count);
    },
    getIDDData: (callback) => {
        console.log(ID);
        callback(ID, step_data);
    }
}