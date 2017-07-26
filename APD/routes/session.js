let userID;
let name = '';
let age = 0;
let height = 0;
let weight = 0;
let exercise;
let gender = 0;

let steps_data;

module.exports = {

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

  setStepsData:(data)=>{
    steps_data = data;
  },

  getStepsData:(callback)=>{
    callback(steps_data);
  },


  getName: (callback) => {
    callback(name)
  },

  getExercise: (callback) => {
    callback(exercise)
  },
  
  getID: (callback) => {
    callback(userID)
  },

  clearExercise: () => {
    exercise.splice(0, 1);
  }
}

