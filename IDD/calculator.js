const Accel = require('./sensor.js');   //가속도 센서 모듈 import

//센서의 X, Y, Z값을 받아온다.

console.log('calculating..');
//변환하여 저장할 값.

let WalkCount = 0;

module.exports = {
    setWalkCount: () => {

        Accel.getAccel();

        let AccelX_1 = Accel.AccelX;
        let AccelY_1 = Accel.AccelY;
        let AccelZ_1 = Accel.AccelZ;
        // console.log(AccelX_1);
        setTimeout(() => {
            Accel.getAccel();
            let AccelX_2 = Accel.AccelX;
            let AccelY_2 = Accel.AccelY;
            let AccelZ_2 = Accel.AccelZ;

            let changeX = Math.abs(Math.abs(AccelX_1) - Math.abs(AccelX_2));
            let changeY = Math.abs(Math.abs(AccelY_1) - Math.abs(AccelY_2));
            let changeZ = Math.abs(Math.abs(AccelZ_1) - Math.abs(AccelZ_2));

            let force = (changeX + changeY + changeZ) * 1000
            // console.log(force);
            if (force > 8000) {
                WalkCount++;
                console.log('Step detected' + WalkCount);
            }
        }, 10);
    },
    getWalkCount: (callback) => {
        callback(WalkCount);
    },
    resetWalkCount: ()=>{
        WalkCount = 0;
    }
}
//운동량 측정 모듈화