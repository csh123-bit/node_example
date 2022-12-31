const express = require('express');
const router = express.Router();
const knex = require('../../config/dbConn');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
var session = require('express-session');// db에 저장하던지 메모리에 저장하던지 해서 처리해야함

const urlencodedParser = bodyParser.urlencoded({ extended: false });

const saltRounds = 10;


// 여기 path 사용해서 바꿔줘야함

router.get('/', (req, res)=>{
    res.render('../views/client/index.html');
});

router.get('/login', (req, res)=>{
    res.render('../views/client/login.html');
});

router.get('/signup', (req, res)=>{
    res.render('../views/client/signup.html');
});

router.post('/login_proc', urlencodedParser, async (req, res)=>{
    var email = req.body.email;
    var password = req.body.pwd;
    
    var data = await knex('board_user').where('usr_email',email);
    if(data.length>0){
        const validPass = await bcrypt.compare(password, data[0].usr_password);
        if(validPass){
            
            res.status(200).json("로그인 되었습니다.");
        }else{
            res.status(200).json("비밀번호가 틀렸습니다.");
        }
    }else{
        res.status(200).json("아이디가 없습니다.");
    }
});

router.post('/signup_proc', urlencodedParser, async (req, res)=>{
    var email = req.body.email;
    var password = await bcrypt.hashSync(req.body.password, 10);
    var address = req.body.address;
    var phoneNumber = req.body.phone_number;
    var name = req.body.name;

    var isSuccess = await knex('board_user')
    .insert({usr_email : email,
            usr_password : password,
            usr_address : address,
            usr_name : name,
            usr_phonenumber : phoneNumber,
            usr_level : 1,
            usr_created_at : new Date()}, ['usr_idx']);

    console.log(isSuccess[0]);
    if(isSuccess[0].usr_idx>0){
        res.status(200).json("성공적으로 가입되었습니다.");
    }else{
        res.status(200).json("가입실패.");
    }
});

module.exports = router;