
const http = require('http');

var ID;

var getRequest

 getRequest = {
  host: '127.0.0.1',
  port: 60001,
  path: '/requestName',
  method: 'GET'
};

	console.log('HTTP Response ongoing');




module.exports.reqName = function (ID, callback) {

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
    console.log(serverdata.patient_name);
		callback(serverdata.patient_name)
	});
	}
}

var req = http.request(getRequest,callback);

req.setHeader("ID", ID);

req.end();

};