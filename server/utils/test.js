const dayjs = require("dayjs")
const path = require("path")
const fs = require('fs')

let a = {
  name: '111',
  age: 18,
  info: function(){
    console.log(this.name + this.age)
  }
}

let b=JSON.stringify(a, function(key, val) {
  if (typeof val === 'function') {
    return val + '';
  }
  return val;
});

let c = JSON.parse(b, function(k,v){
  if(v.indexOf && v.indexOf('function') > -1){
     return eval("(function(){return "+v+" })()")
  }
  return v;
});

console.log(c.info.toString())