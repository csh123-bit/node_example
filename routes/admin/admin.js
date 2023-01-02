const express = require('express');
const router = express.Router();
const knex = require('../../config/dbConn');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/', (req, res)=>{
    res.render('../views/admin/index.html');// 여기 path 사용해서 바꿔줘야함
});

router.get('/login', (req, res)=>{
    res.render('../views/admina/login.html');
});

router.get('/board', async (req, res)=>{
    var boardList = await knex('board_config').select();
    res.render('../views/admin/board.html', {lists:boardList});
});

router.get('/add_board', (req, res)=>{
    res.render('../views/admin/addboard.html');
});

// 게시판 설정 저장
router.post('/board_config', urlencodedParser, async (req, res)=>{
    var board_code = req.body.board_code;
    var board_skin = req.body.board_skin;
    var board_per_page = req.body.board_page;
    var board_name = req.body.board_name;

    var isSuccess = await knex('board_config')
    .insert({bod_code : board_code,
            bod_skin : board_skin,
            bod_per_page : board_per_page,
            bod_name : board_name,
            bod_created_at : new Date()}, ['bod_idx']);

    console.log(isSuccess[0]);
    if(isSuccess[0].bod_idx>0){
        res.status(200).json("저장 되었습니다.");
    }else{
        res.status(200).json("저장실패.");
    }

});


module.exports = router;