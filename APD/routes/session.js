//세션 정보 변수
let userID;
let name = '';
let age = 0;
let height = 0;
let weight = 0;
let exercise;
let gender = 0;

module.exports = {
//세션 설정 함수
  setupSession: (valueID, valueName, valueAge, valueHeight, valueWeight, valueExercise, valueGender) => {
    console.log(valueID, valueName, valueAge, valueHeight, valueWeight, valueExercise, valueGender);
    userID = valueID;
    name = valueName;
    age = valueAge;
    height = valueHeight;
    weight = valueWeight;
    exercise = valueExercise;
    gender = valueGender;
  },

  //이름 반환 함수
  getName: (callback) => {
    callback(name)
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

