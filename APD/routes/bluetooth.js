var noble = require('noble');

let try_count = 0;
let steps_data;
let ID;


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

            setTimeout(function(){
                peripheral.disconnect();
            }, 1000);
            });
    
        });
        
module.exports = {
    getTryCount: (callback) => {
        callback(try_count);
    },
    getIDDData:(callback) => {
        callback(ID, steps_data);
    }
}