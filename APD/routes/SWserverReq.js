
const http = require('http');										//http 요청 모듈

//리턴값 저장 변수

let userID = 'noname';
let name = '';
let exercise = '';
let weight = 0;
let height = 0;
let age = 0;
let gender = 0;

let image = '';
let count = 1000;
let comment = '';
let title = '';

let is_opened = false;

let exercise_done = 0;
let move_done = 0;

//서버 IP
let serverIP = '127.0.0.1';

getUserInfoRequest = {														//GET요청 JSON데이터 정의
	host: serverIP,
	port: 60001,
	path: '/APD/userdata/UserInfo',
	method: 'GET'
};


getExerciseInfoRequest = {														//GET요청 JSON데이터 정의
	host: serverIP,
	port: 60001,
	path: '/APD/userdata/Exercise',
	method: 'GET'
};

getAchievementRequest = {														//GET요청 JSON데이터 정의
	host: serverIP,
	port: 60001,
	path: '/APD/userdata/Achievement',
	method: 'GET'
};

getIsOpenedRequest = {														//GET요청 JSON데이터 정의
	host: serverIP,
	port: 60001,
	path: '/APD/metadata/IsOpen',
	method: 'GET'
};


submitUserSteps = {														//POST요청 JSON데이터 정의
	host: serverIP,
	port: 60001,
	path: '/APD/userdata/UserSteps',
	method: 'POST'
};

submitDoneUserExercise = {														//POST요청 JSON데이터 정의
	host: serverIP,
	port: 60001,
	path: '/APD/userdata/Exercise',
	method: 'DELETE'
};

submitEnviorment = {														//POST요청 JSON데이터 정의
	host: serverIP,
	port: 60001,
	path: '/APD/metadata/Enviorment',
	method: 'DELETE'
};
submitError = {														//POST요청 JSON데이터 정의
	host: serverIP,
	port: 60001,
	path: '/APD/metadata/Error',
	method: 'POST'
};

console.log('HTTP module OK');


module.exports = {
	requestUserInfo: (ID) => {
		//요청 데이터 수신 콜백함수
		getUserInfocallback = function (response) {
			console.log('HTTP Response Code : ' + response.statusCode);		//리턴코드를 분석하여 상태 확인
			if (response.statusCode != 200) {
				console.log('Error Response!');

				req.on('error', (e) => {
					console.error(`problem with request: ${e.message}`);
				});
			} else {
				let serverdata = '';

				response.on('data', function (chunk) {							//응답 데이터를 JSON형태로 파싱함
					serverdata = JSON.parse(chunk);
				});
				response.on('end', function () {									//응답이 끝났을 시 데이터 추출
					console.log(serverdata);
					console.log(serverdata.patient_name);
					userID = ID;
					name = serverdata.patient_name;
					age = serverdata.patient_Age;
					height = serverdata.patient_Height;
					weight = serverdata.patient_Weight;
					gender = serverdata.patient_Gender;
					exercise = serverdata.patient_Exercise;

				});
			}
		}

		let req = http.request(getUserInfoRequest, getUserInfocallback);						//GET요청 전송
req.on('error', function(error) {

	console.log('관리서버와 연결할 수 없습니다.'); 								// 관리서버와 연결 불가능할 때에 오류 체크

});
		req.setHeader("idd_id", ID);											//헤더에 요청 데이터 첨부

		req.end();

	},

	requestExercise: (exercise) => {
		//요청 데이터 수신 콜백함수
		getExerciseInfocallback = function (response) {
			console.log('HTTP Response Code : ' + response.statusCode);		//리턴코드를 분석하여 상태 확인
			if (response.statusCode != 200) {
				console.log('Error Response!');
				console.log('Error Response!');

				req.on('error', (e) => {
					console.error(`problem with request: ${e.message}`);
				});
			} else {
				let serverdata = '';
				response.on('data', function (chunk) {							//응답 데이터를 JSON형태로 파싱함
					serverdata = JSON.parse(chunk);
				});
				response.on('end', function () {									//응답이 끝났을 시 데이터 추출
					console.log(serverdata);
					console.log(serverdata.patient_name);
					image = serverdata.exercise_image;
					count = serverdata.exercise_count;
					comment = serverdata.exercise_comment;
					title = serverdata.exercise_title;
				});
			}
		}

		let req = http.request(getExerciseInfoRequest, getExerciseInfocallback);						//GET요청 전송
req.on('error', function(error) {

	console.log('관리서버와 연결할 수 없습니다.');								// 관리서버와 연결 불가능할 때에 오류 체크

});
		req.setHeader("program_id", exercise);											//헤더에 요청 데이터 첨부

		req.end();

	},

requestAchievement: (ID) => {
		//요청 데이터 수신 콜백함수
		requestAchievementcallback = function (response) {
			console.log('HTTP Response Code : ' + response.statusCode);		//리턴코드를 분석하여 상태 확인
			if (response.statusCode != 200) {
				console.log('Error Response!');
				console.log('Error Response!');

				req.on('error', (e) => {
					console.error(`problem with request: ${e.message}`);
				});
			} else {
				let serverdata = '';
				response.on('data', function (chunk) {							//응답 데이터를 JSON형태로 파싱함
					serverdata = JSON.parse(chunk);
				});
				response.on('end', function () {									//응답이 끝났을 시 데이터 추출
					console.log(serverdata);
					console.log(serverdata.patient_name);
					exercise_done = serverdata.exercise_done;
					move_done = serverdata.move_done;
				});
			}
		}

		let req = http.request(getAchievementRequest, requestAchievementcallback);						//GET요청 전송
req.on('error', function(error) {

	console.log('관리서버와 연결할 수 없습니다.');								// 관리서버와 연결 불가능할 때에 오류 체크

});
		req.setHeader("ID", ID);											//헤더에 요청 데이터 첨부

		req.end();

	},

	requestIsOpened: (ID) => {
		//요청 데이터 수신 콜백함수
		getIsOpenedcallback = function (response) {


			console.log('HTTP Response Code : ' + response.statusCode);		//리턴코드를 분석하여 상태 확인
			if (response.statusCode != 200) {
				console.log('Error Response!');
				console.log('Error Response!');

				req.on('error', (e) => {
					console.error(`problem with request: ${e.message}`);
				});
			} else {
				let serverdata = '';
				response.on('data', function (chunk) {							//응답 데이터를 JSON형태로 파싱함
					serverdata = JSON.parse(chunk);
				});
				response.on('end', function () {									//응답이 끝났을 시 데이터 추출
					console.log(serverdata);
					console.log(serverdata.patient_name);
					is_opened = serverdata.is_opened;
				});
			}
		}
   let req = http.request(getIsOpenedRequest, getIsOpenedcallback);	

req.on('error', function(error) {

	console.log('관리서버와 연결할 수 없습니다.');								// 관리서버와 연결 불가능할 때에 오류 체크

});

							//GET요청 전송

		req.setHeader("apd_id", ID);											//헤더에 요청 데이터 첨부

		req.end();

	},

	UserStepSubmit: (ID, steps, step_date) => {
		UserStepSubmitback = function (response) {
			console.log('HTTP Response Code : ' + response.statusCode);		//리턴코드를 분석하여 상태 확인
			if (response.statusCode != 200) {
				console.log('Error Response!');
				console.log('Error Response!');

				req.on('error', (e) => {
					console.error(`problem with request: ${e.message}`);
				});
			} else {
				let serverdata = '';
				response.on('data', function (chunk) {							//응답 데이터를 JSON형태로 파싱함
					serverdata = JSON.parse(chunk);
				});
				response.on('end', function () {									//응답이 끝났을 시 데이터 추출
					console.log(serverdata);
				});
			}
		}

		let req = http.request(submitUserSteps, UserStepSubmitback);						//POST요청 전송
req.on('error', function(error) {

	console.log('관리서버와 연결할 수 없습니다.');								// 관리서버와 연결 불가능할 때에 오류 체크

});
		req.setHeader("idd_id", ID);											//헤더에 요청 데이터 첨부
		req.setHeader("steps", steps);
		req.setHeader("step_date", step_date);

		req.end();
	},


	UserExerciseSubmit: (ID, exercise) => {
		UserExerciseSubmitcallback = function (response) {
			console.log('HTTP Response Code : ' + response.statusCode);		//리턴코드를 분석하여 상태 확인
			if (response.statusCode != 200) {
				console.log('Error Response!');
				console.log('Error Response!');

				req.on('error', (e) => {
					console.error(`problem with request: ${e.message}`);
				});
			} else {
				let serverdata = '';
				response.on('data', function (chunk) {							//응답 데이터를 JSON형태로 파싱함
					serverdata = JSON.parse(chunk);
				});
				response.on('end', function () {									//응답이 끝났을 시 데이터 추출
					console.log(serverdata);
				});
			}
		}

		let req = http.request(submitDoneUserExercise, UserExerciseSubmitcallback);						//POST요청 전송
req.on('error', function(error) {

	console.log('관리서버와 연결할 수 없습니다.');								// 관리서버와 연결 불가능할 때에 오류 체크

});
		req.setHeader("ID", ID);											//헤더에 요청 데이터 첨부
		req.setHeader("exercise", exercise);

		req.end();
	},

	EnviormentSubmit: (ID, temperature, humidity, audio, envelope, light) => {
		EnviormentSubmitcallback = function (response) {
			console.log('HTTP Response Code : ' + response.statusCode);		//리턴코드를 분석하여 상태 확인
			if (response.statusCode != 200) {
				console.log('Error Response!');
				console.log('Error Response!');

				req.on('error', (e) => {
					console.error(`problem with request: ${e.message}`);
				});
			} else {
				let serverdata = '';
				response.on('data', function (chunk) {							//응답 데이터를 JSON형태로 파싱함
					serverdata = JSON.parse(chunk);
				});
				response.on('end', function () {									//응답이 끝났을 시 데이터 추출
					console.log(serverdata);
				});
			}
		}

		let req = http.request(submitEnviorment, EnviormentSubmitcallback);						//POST요청 전송
req.on('error', function(error) {

	console.log('관리서버와 연결할 수 없습니다.');								// 관리서버와 연결 불가능할 때에 오류 체크

});
		req.setHeader("ID", ID);											//헤더에 요청 데이터 첨부
		req.setHeader("temperature", temperature);
		req.setHeader("humidity",humidityHumi);
			req.setHeader("audio", audio);
		req.setHeader("envelope", envelope);
			req.setHeader("light", light);


		req.end();
	},


	ErrorSubmit: (error) => {
		ErrorSubmitcallback = function (response) {
			console.log('HTTP Response Code : ' + response.statusCode);		//리턴코드를 분석하여 상태 확인
			if (response.statusCode != 200) {
				console.log('Error Response!');
				console.log('Error Response!');

				req.on('error', (e) => {
					console.error(`problem with request: ${e.message}`);
				});
			} else {
				let serverdata = '';
				response.on('data', function (chunk) {							//응답 데이터를 JSON형태로 파싱함
					serverdata = JSON.parse(chunk);
				});
				response.on('end', function () {									//응답이 끝났을 시 데이터 추출
					console.log(serverdata);
				});
			}
		}

		let req = http.request(submitError, ErrorSubmitcallback);						//POST요청 전송
req.on('error', function(error) {

	console.log('관리서버와 연결할 수 없습니다.');								// 관리서버와 연결 불가능할 때에 오류 체크

});
		req.setHeader("error_log", error);											//헤더에 요청 데이터 첨부

		req.end();
	},


	getInfo: (callback) => {
		callback(userID, name, age, height, weight, exercise, gender);
	},

	getName: (callback) => {
		callback(name);
	},

	getExercise: (callback) => {
		callback(image, count, comment, title);
	},

	getIsOpened: (callback) => {
		callback(is_opened);
	},

	setIP:(IP)=>{
serverIP = IP;
	},

	clearSWserver:() => {

 userID = 'noname';
 name = '';
 exercise = '';
 weight = 0;
 height = 0;
 age = 0;
 gender = 0;
 image = '';
 count = 1000;
 comment = '';
 title = '';

 is_opened = false;
	}
}

//요청 모듈화(ID값을 파라메터로 받음)