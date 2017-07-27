
const http = require('http');										//http 요청 모듈

//리턴값 저장 변수
let getRequest;														//GET요청 JSON데이터

let userID;
let name = '';
let exercise = '';
let weight = 0;
let height = 0;
let age = 0;
let gender = 0;

let image;
let count = 1000;
let comment;
let title;
let discription;

let is_opened = false;

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

getIsOpenedRequest = {														//GET요청 JSON데이터 정의
	host: serverIP,
	port: 60001,
	path: '/APD/metadata/IsOpen',
	method: 'GET'
};


submitUserSteps = {														//GET요청 JSON데이터 정의
	host: serverIP,
	port: 60001,
	path: '/APD/userdata/UserSteps',
	method: 'POST'
};

submitUserExercise = {														//GET요청 JSON데이터 정의
	host: serverIP,
	port: 60001,
	path: '/APD/userdata/Exercise',
	method: 'POST'
};

submitError = {														//GET요청 JSON데이터 정의
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

		req.setHeader("idd_id", ID);											//헤더에 요청 데이터 첨부

		req.end();

	},

	requestExercise: (exercise) => {
		//요청 데이터 수신 콜백함수
		getExerciseInfocallback = function (response) {
			console.log('HTTP Response Code : ' + response.statusCode);		//리턴코드를 분석하여 상태 확인
			if (response.statusCode != 200) {
				console.log('Error Response!');
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

		req.setHeader("program_id", exercise);											//헤더에 요청 데이터 첨부

		req.end();

	},

	requestIsOpened: (ID) => {
		//요청 데이터 수신 콜백함수
		getIsOpenedcallback = function (response) {
			console.log('HTTP Response Code : ' + response.statusCode);		//리턴코드를 분석하여 상태 확인
			if (response.statusCode != 200) {
				console.log('Error Response!');
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

		let req = http.request(getIsOpenedRequest, getIsOpenedcallback);						//GET요청 전송

		req.setHeader("apd_id", ID);											//헤더에 요청 데이터 첨부

		req.end();

	},

	UserStepSubmit: (ID, steps, step_date) => {
		UserStepSubmitback = function (response) {
			console.log('HTTP Response Code : ' + response.statusCode);		//리턴코드를 분석하여 상태 확인
			if (response.statusCode != 200) {
				console.log('Error Response!');
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

		let req = http.request(submitUserSteps, UserStepSubmitback);						//GET요청 전송

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

		let req = http.request(submitUserExercise, UserExerciseSubmitcallback);						//GET요청 전송

		req.setHeader("ID", ID);											//헤더에 요청 데이터 첨부
		req.setHeader("exercise", exercise);

		req.end();
	},

	ErrorSubmit: (error) => {
		ErrorSubmitcallback = function (response) {
			console.log('HTTP Response Code : ' + response.statusCode);		//리턴코드를 분석하여 상태 확인
			if (response.statusCode != 200) {
				console.log('Error Response!');
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

		let req = http.request(submitError, ErrorSubmitcallback);						//GET요청 전송

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
	}
}

//요청 모듈화(ID값을 파라메터로 받음)
