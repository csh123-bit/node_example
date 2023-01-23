const express = require('express');
const router = express.Router();
const knex = require('../../config/dbConn');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const app = express();

const urlencodedParser = bodyParser.urlencoded({ extended: false });



// 여기 path 사용해서 바꿔줘야함
router.get('/', (req, res)=>{
    res.render('../views/client/index.html');
});

router.get('/login', (req, res)=>{
    if(req.session.user){
        return res.status(200).json('이미 로그인 되어 있습니다.');
    }
    res.render('../views/client/login.html');
});

router.get('/signup', (req, res)=>{
    res.render('../views/client/signup.html');
});

router.get('/logout', (req, res)=>{
    req.session.destroy((err)=>{
        res.redirect('/');
    });    
});

router.post('/login_proc', urlencodedParser, async (req, res)=>{
    var email = req.body.email;
    var password = req.body.pwd;
    
    var data = await knex('board_user').where('usr_email',email);
    if(data.length>0){
        const validPass = await bcrypt.compare(password, data[0].usr_password);
        if(validPass){
            if(req.session.usr_idx===undefined){//세션부분 다시 공부 및 수정
                req.session.user = {usr_idx:data[0].usr_idx,
                                    usr_level:data[0].usr_level,
                                    usr_name:data[0].usr_name,
                                    usr_email:data[0].usr_email};
                req.session.save(()=>{
                    res.redirect('/');
                });
                
            }else{
                //console.log(req.session.usr_idx);
                res.redirect('/');
            }
        }else{
            res.status(200).json("비밀번호가 틀렸습니다.");
        }
    }else{
        res.status(200).json("아이디가 존재하지 않습니다.");
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