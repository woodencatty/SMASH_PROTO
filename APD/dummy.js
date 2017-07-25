//Temp server for response at GET

const express = require('express');
const app = express();

app.listen(60001, () => {
    console.log("dummy server2 enable");
});

app.get('/requestUserInfo', (req, res) => {

    console.log('User data get!');

    res.set('Content-Format', 'application/json');
    var json_array = JSON.stringify({
        content_type: "Application/json",
        result_code: 200,
        result_req: "",
        patient_name: '김환자',
        patient_Age: '50',
        patient_Height: '160',
        patient_Weight: '52',
        patient_Gender: 'f',
        patient_Exercise: ['exercise1', 'exercise2', 'exercise3', 'done']
    });
    res.end(json_array);

});

app.get('/requestExercise', (req, res) => {

    console.log('Exercise data get!');
    var imagefile = '';
    var comment = '';
    if (req.header('exercise') = 'exercise1') {
        imagefile = 'move1.gif';
        comment = '준비운동(묵빠운동) <br /> 동작을 잘 보고 따라해주세요.<br /> (2초씩 10회 반복)';
    } else if (req.header('exercise') = 'exercise2') {
        imagefile = 'move2.gif';
        comment = '본 운동(팔 비대칭 올리기) <br /> 동작을 잘 보고 따라해주세요.<br /> (2초씩 10회 반복)';
    } else if (req.header('exercise') = 'exercise3') {
        imagefile = 'move3.gif';
        comment = '정리운동(등근육펴기) <br /> 동작을 잘 보고 따라해주세요.<br /> (2초씩 10회 반복)';
    }

    res.set('Content-Format', 'application/json');
    var json_array = JSON.stringify({
        content_type: "Application/json",
        result_code: 200,
        result_req: "",
        image: imagefile,
        count: 10,
        comment: comment
    });
    res.end(json_array);

});

app.post('/submitUserSteps', (req, res) => {
    console.log(req);

});
