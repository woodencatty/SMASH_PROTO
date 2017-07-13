
const http = require('http');
const bluetooth = require('./bluetooth.js')

var ID;

var getRequest

 getRequest = {
  host: '127.0.0.1',
  port: 60001,
  path: '/requestName',
  method: 'GET'
};

	console.log('HTTP Response ongoing');


  BLECallback = function (IDValue) {
    ID = IDValue;
  }


//module.exports.reqName = function (callback) {

callback = function(response){
	console.log('HTTP Response Code : ' +response.statusCode);
	if(response.statusCode != 200){
		console.log('Error Response!');

	}else{
	var serverdata = '';
	response.on('data', function(chunk){
		serverdata = JSON.parse(chunk);
	});	
	response.on('end',function(){
		console.log(serverdata);
    console.log(serverdata.serial_number);
	});
	}
}


bluetooth.searchIDD();

setTimeout(function(){
bluetooth.Getdata(BLECallback);
  }, 4000);

setTimeout(function(){
    console.log('ID is : ' + ID);
var req = http.request(getRequest,callback);

req.setHeader("ID", 'P0001');

req.end();
  }, 4000);


//};