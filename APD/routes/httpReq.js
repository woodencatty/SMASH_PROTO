
const http = require('http');										//http 요청 모듈

											//리턴값 저장 변수
let getRequest;														//GET요청 JSON데이터

let name = '';
let exercise ='';
let weight = 0;
let height = 0;
let age = 0;

 getRequest = {														//GET요청 JSON데이터 정의
  host: '127.0.0.1',
  port: 60001,
  path: '/requestName',
  method: 'GET'
};


 postRequest = {														//GET요청 JSON데이터 정의
  host: '127.0.0.1',
  port: 60001,
  path: '/submitUserSteps',
  method: 'POST'
};


console.log('HTTP module OK');	


module.exports = {
getInfo : function (ID) {

//요청 데이터 수신 콜백함수
getcallback = function(response){
	console.log('HTTP Response Code : ' +response.statusCode);		//리턴코드를 분석하여 상태 확인
	if(response.statusCode != 200){
		console.log('Error Response!');
	}else{
	let serverdata = '';
	response.on('data', function(chunk){							//응답 데이터를 JSON형태로 파싱함
		serverdata = JSON.parse(chunk);
	});	
	response.on('end',function(){									//응답이 끝났을 시 데이터 추출
		console.log(serverdata);
    console.log(serverdata.patient_name);
		name = serverdata.patient_name;
		exercise = serverdata.patient_exercise;
		age = serverdata.patient_age;
		height = serverdata.patient_height;
		weight = serverdata.patient_weight;
	});
	}
}

let req = http.request(getRequest,getcallback);						//GET요청 전송

req.setHeader("ID", ID);											//헤더에 요청 데이터 첨부

req.end();

},

putInfo: function(ID, Steps){
postcallback = function(response){
	console.log('HTTP Response Code : ' +response.statusCode);		//리턴코드를 분석하여 상태 확인
	if(response.statusCode != 200){
		console.log('Error Response!');
	}else{
	let serverdata = '';
	response.on('data', function(chunk){							//응답 데이터를 JSON형태로 파싱함
		serverdata = JSON.parse(chunk);
	});	
	response.on('end',function(){									//응답이 끝났을 시 데이터 추출
		console.log(serverdata);
	});
	}
}

let req = http.request(postRequest,postcallback);						//GET요청 전송

req.setHeader("ID", ID);											//헤더에 요청 데이터 첨부
req.setHeader("ID", Steps);	

req.end();
},

getInfo : function(callback){
	callback(name, age, height, weight, exercise);
},

getName : function(callback){
	callback(name);
},

getExercise : function(callback){
	callback(exercise);
}
}															

//요청 모듈화(ID값을 파라메터로 받음)
