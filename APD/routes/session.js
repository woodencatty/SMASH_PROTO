
let name = '';
let age = 0;
let height = 0;
let weight = 0;


module.exports = {

  setupSession: function (valueName, valueAge, valueHeight, valueWeight) {
    name = valueName;
    age = valueAge;
    height = valueHeight;
    weight = valueWeight;
  },

  getNmae: function (callback) {
    callback(name)
  }
}

