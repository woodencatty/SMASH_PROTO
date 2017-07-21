
let name = '';
let age = 0;
let height = 0;
let weight = 0;
let exercise;
let gender = 0;

module.exports = {

  setupSession: (valueName, valueAge, valueHeight, valueWeight, valueExercise, valueGender) => {

        console.log(name, age, height, weight, exercise, gender);


    name = valueName;
    age = valueAge;
    height = valueHeight;
    weight = valueWeight;
    exercise = valueExercise;
    gender = valueGender;
  },

  getName: (callback) => {
    callback(name)
  },

  getExercise: (callback) => {
    console.log(exercise);

    callback(exercise)
  },

  clearExercise: () => {
    exercise.splice(0, 1);
  }
}

