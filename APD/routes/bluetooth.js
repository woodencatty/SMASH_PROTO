var noble = require('noble');       //Bluetooth Central모듈(noble). 값을 받아오기 위해 var로 설정..
require('date-utils');              //시간 변환을 위한 모듈


let try_count = 0;                  //시도 횟수 변수
let ID = 'noname';                  //ID 저장 변수


let steps = 0;                      //걸음 수 변수
let step_date;                      //측정 날짜


//상태 표시 로그
noble.on('scanStart', () => {
    console.log('status : scanning');
});

noble.on('scanStop', () => {
    console.log('status : scan stop');
});

module.exports = {

    //탐색 및 데이터 수집 모듈
    startScanning: () => {
        try_count++;
        noble.startScanning(['fff0'], false);
        noble.on('discover', (peripheral) => {
            console.log('find : ' + peripheral.advertisement.localName + "(" + peripheral.address + ")");
            peripheral.connect((error) => {
                                        ID = peripheral.advertisement.localName;

                peripheral.discoverSomeServicesAndCharacteristics(['fff0'], ['fff1'], (error, services, characteristics) => {
                    characteristics[0].subscribe();
                    characteristics[0].read();
                    characteristics[0].on('data', (data, isNotification) => {
                        let data_String = data.toString('utf8');
                        let data_array = data_String.split(',');
                        steps = data_array[0];
                        step_date = new Date(data_array[1], data_array[2], data_array[3], data_array[4], data_array[5], data_array[6], 0);
                    });
                });
            });
            setTimeout(() => {
                peripheral.disconnect();
            }, 4000);
        });
    },

//데이터 반환 콜백
    getTryCount: (callback) => {
        callback(try_count);
    },

    getIDDData: (callback) => {
        console.log(ID);
        console.log(steps);
        console.log(step_date);
        callback(ID, steps, step_date);
    },

    //초기화
    resetBLE: () => {
        try_count = 0;
        ID = 'noname';
        steps = 0;
        step_date = null;
    }
}