//Temp server for response at GET

const express = require('express');
const app = express();

app.listen(60001, () => {
    console.log("dummy server2 enable");
});


app.get('/apd/metadata/isopen', (req, res) => {

    console.log('Opened data Requested!');

    res.set('Content-Format', 'application/json');
    var json_array = JSON.stringify({
        content_type: "Application/json",
        result_code: 200,
        result_req: "",
        is_opened: true
    });
    res.end(json_array);
});


app.get('/apd/userdata/userinfo', (req, res) => {

    console.log('User data Requested!');

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
        patient_exercise_done: 40,
        patient_stepcount: 67,
        patient_Exercise: [{id: 'exercise1',count: 5, imagefile:'/images/트레이너/1-1준비운동(어깨)-묵.gif' , title:'준비운동(묵빠운동)' , comment:' 동작을 잘 보고 따라해주세요.(2초씩 10회 반복)' }, {id: 'exercise2', count: 5,imagefile:'/images/트레이너/2-2본운동(팔비대칭올리기).gif' , title:'본 운동(팔 비대칭 올리기)' , comment:' 동작을 잘 보고 따라해주세요.(2초씩 10회 반복)' }, {id: 'exercise3', count: 5,imagefile: '/images/트레이너/3-1정리운동(등근육펴기).gif' , title:'정리운동(등근육펴기)' , comment:' 동작을 잘 보고 따라해주세요.(2초씩 10회 반복)' }, {id: 'done',count: 0, imagefile: '' , title:'' , comment:'' }]
    });
    res.end(json_array);

});

app.get('/apd/userdata/exercise', (req, res) => {

    console.log('Exercise data Requested!' + req.headers.program_id);
    var imagefile = '';
    var comment = '';
    if (req.headers.program_id == 'exercise1') {
        imagefile = '/images/트레이너/1-1준비운동(어깨)-묵.gif';
        title = '준비운동(묵빠운동)';
        comment = ' 동작을 잘 보고 따라해주세요.(2초씩 10회 반복)';
    } else if (req.headers.program_id == 'exercise2') {
        imagefile = '/images/트레이너/2-2본운동(팔비대칭올리기).gif';
        title = '본 운동(팔 비대칭 올리기)';
        comment = ' 동작을 잘 보고 따라해주세요.(2초씩 10회 반복)';
    } else if (req.headers.program_id == 'exercise3') {
        imagefile = '/images/트레이너/3-1정리운동(등근육펴기).gif';
        title = '정리운동(등근육펴기)';
        comment = ' 동작을 잘 보고 따라해주세요.(2초씩 10회 반복)';
    }else if (req.headers.program_id == 'done') {
        imagefile = '';
        title = '';
        comment = '';
    }

    res.set('Content-Format', 'application/json');
    var json_array = JSON.stringify({
        content_type: "Application/json",
        result_code: 200,
        result_req: "",
        exercise_image: imagefile,
        exercise_count: 20,
        exercise_comment: comment,
        exercise_title: title,
    });
    res.end(json_array);

});

app.post('/apd/userdata/usersteps', (req, res) => {
    console.log('Data submitted : ' + req.headers.idd_id + '  /  ' + req.headers.step_data);
});


app.delete('/apd/userdata/exercise', (req, res) => {
    console.log('Data submitted : ' + req.headers.idd_id + '  /  ' + req.headers.program_id);
});

app.post('/apd/metadata/error', (req, res) => {
    console.log('Data submitted : ' + req.headers.error_log);
});

app.post('/apd/metadata/enviorment', (req, res) => {
    console.log('Data submitted : ' + req.headers);
});