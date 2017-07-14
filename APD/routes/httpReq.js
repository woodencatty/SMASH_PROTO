
const http = require('http');										//http 요청 모듈

var name;															//리턴값 저장 변수
var getRequest;														//GET요청 JSON데이터


 getRequest = {														//GET요청 JSON데이터 정의
  host: '127.0.0.1',
  port: 60001,
  path: '/requestName',
  method: 'GET'
};

console.log('HTTP module OK');										

//요청 모듈화(ID값을 파라메터로 받음)
module.exports.reqName = function (ID, callback) {

//요청 데이터 수신 콜백함수
getcallback = function(response){
	console.log('HTTP Response Code : ' +response.statusCode);		//리턴코드를 분석하여 상태 확인
	if(response.statusCode != 200){
		console.log('Error Response!');
	}else{
	var serverdata = '';
	response.on('data', function(chunk){							//응답 데이터를 JSON형태로 파싱함
		serverdata = JSON.parse(chunk);
	});	
	response.on('end',function(){									//응답이 끝났을 시 데이터 추출
		console.log(serverdata);
    console.log(serverdata.patient_name);
		name = serverdata.patient_name;
	});
	}
}

var req = http.request(getRequest,getcallback);						//GET요청 전송

req.setHeader("ID", ID);											//헤더에 요청 데이터 첨부

req.end();

setTimeout(function(){
    		callback(name);											//데이터 수신이 끝날 때 즈음 데이터 반환
      }, 500);

};