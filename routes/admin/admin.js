const express = require('express');
const router = express.Router();

router.get('/', (req, res)=>{
    res.render('../views/admin/index.html');// 여기 path 사용해서 바꿔줘야함
});

router.get('/login', (req, res)=>{
    res.render('../views/admina/login.html');
});

router.get('/board', (req, res)=>{
    res.render('../views/admin/board.html');
});


module.exports = router;