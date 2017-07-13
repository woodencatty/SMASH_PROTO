
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
    console.log('ID is : ' + ID);
  }


//module.exports.reqName = function (callback) {

bluetooth.searchIDD();
setTimeout(function(){
bluetooth.Getdata(BLECallback);
  }, 2000);
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
setTimeout(function(){

var req = http.request(getRequest,callback);

req.setHeader("ID", 'P0001');

req.end();
  }, 4000);
//};