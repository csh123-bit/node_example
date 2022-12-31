const express = require('express');
const router = express.Router();
const knex = require('../../config/dbConn');
const bodyParser = require('body-parser')

const urlencodedParser = bodyParser.urlencoded({ extended: false })

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
        if(data[0].usr_password == password){// 값 한개만 가져오는거 연구
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
    var password = req.body.password;
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

    console.log(isSuccess);
    if(isSuccess[0].length>0){
        res.status(200).json("성공적으로 가입되었습니다.");
    }else{
        res.status(200).json("가입실패.");
    }
    res.status(200).json(isSuccess);
});

module.exports = router;