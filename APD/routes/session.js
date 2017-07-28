//세션 정보 변수
const SWserver = require('./SWserverReq.js');


let userID;
let name = '';
let age = 0;
let height = 0;
let weight = 0;
let exercise = [];


let gender = 0;
let exercise_done = 0;
let stepcount = 0;

let senseInterval = 0;
let serverIP = 0;
let port = 0;

let version = 0.0;
let deviceName = '';

module.exports = {
  //세션 설정 함수
  setupUser: (_ID, _Name, _Age, _Height, _Weight, _Exercise, _Gender, _Exercise_done, _Stepcount) => {
    let i = 0;
    userID = _ID;
    name = _Name;
    age = _Age;
    height = _Height;
    weight = _Weight;
    gender = _Gender;
    exercise_done = _Exercise_done;
    stepcount = _Stepcount;
    exercise = _Exercise;
    
  },
  setupSettings: (_serverIP, _port, _version, _deviceName) => {
    console.log(_serverIP + _port);
    serverIP = _serverIP;
    port = _port;
    version = _version;
    deviceName = _deviceName;
  },

  //이름 반환 함수
  getName: (callback) => {
    callback(name)
  },

  getDeviceName: (callback) => {
    callback(deviceName)
  },
  //운동 프로그램 ID 반환 함수
  getExercise: (callback) => {
    callback(exercise)
  },

  //유저ID 반환함수
  getID: (callback) => {
    callback(userID)
  },
  //운동 프로그램 완료 함수
  clearExercise: () => {
    exercise.splice(0, 1);
  },

  //세션 초기화 함수
  clearSession: () => {
    userID = null;
    name = '';
    age = 0;
    height = 0;
    weight = 0;
    exercise = null;
    gender = 0;

    steps = 0;
    step_date = null;
  }
}

