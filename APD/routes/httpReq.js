
const http = require('http');

var name;

var getRequest

 getRequest = {
  host: '127.0.0.1',
  port: 60001,
  path: '/requestName',
  method: 'GET'
};

	console.log('HTTP Response ongoing');




module.exports.reqName = function (ID, callback) {
if(ID == 'notfound'){
	    callback('User Not found');
}
getcallback = function(response){
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
		name = serverdata.patient_name;
	});
	}
}

var req = http.request(getRequest,getcallback);

req.setHeader("ID", ID);

req.end();

setTimeout(function(){
    		callback(name);
      }, 500);

};