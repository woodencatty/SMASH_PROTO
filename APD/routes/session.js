const fs = require('fs');


module.exports = {
  name: '',
  age: 0,
  height: 0,
  weight: 0,

  setupSession: function(name, age, height, weight){
    this.name = name;
    this.age = age;
    this.height = height;
    this.weight = weight;
  }
}

