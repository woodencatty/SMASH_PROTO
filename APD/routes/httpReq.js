
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



  IDCallback = function (IDValue) {
    ID = IDValue;

  }


module.exports.reqName = function (callback) {

bluetooth.searchIDD();

bluetooth.Getdata(IDCallback)

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
	});
	}
}

var req = http.request(getRequest,callback);

req.setHeader("ID", ID);

req.end();


};