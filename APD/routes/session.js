
let name = '';
let age = 0;
let height = 0;
let weight = 0;
let exercise;
let gender = 0;

let steps_data;

module.exports = {

  setupSession: (valueName, valueAge, valueHeight, valueWeight, valueExercise, valueGender) => {
        console.log(valueName, valueAge, valueHeight, valueWeight, valueExercise, valueGender);

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

  getName: (callback) => {
    callback(name)
  },

  getExercise: (callback) => {

    callback(exercise)
  },

  clearExercise: () => {
    exercise.splice(0, 1);
  }
}

