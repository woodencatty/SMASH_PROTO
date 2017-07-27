
let userID;
let name = '';
let age = 0;
let height = 0;
let weight = 0;
let exercise;
let gender = 0;

let steps= 0;
let step_date;

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

  setStepsData:(valueSteps, valueStepDate)=>{
    steps = valueSteps;
    steps_date = valueStepDate;
  },

  getStepsData:(callback)=>{
    callback(steps, step_date);
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

