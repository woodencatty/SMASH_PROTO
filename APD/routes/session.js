
let name = '';
let age = 0;
let height = 0;
let weight = 0;
let exercise;

module.exports = {

  setupSession: function (valueName, valueAge, valueHeight, valueWeight, valueExercise) {
    name = valueName;
    age = valueAge;
    height = valueHeight;
    weight = valueWeight;
    exercise = valueExercise;
  },

  getName: function (callback) {
    callback(name)
  },

  getExercise: function (callback) {
    callback(exercise)
  },

  clearExercise:function(){
    exercise.splice(0,1);
  }
}

