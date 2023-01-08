const express = require('express');
const router = express.Router();
const knex = require('../../config/dbConn');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/:code', urlencodedParser, async (req, res)=>{
    var code = req.params.code;

    var boardData = await knex('board_data_'+code).select();
    var boardConfig = await knex('board_config').where({'boc_code':code});

    console.log(boardData);
    console.log(boardConfig);
    console.log(code);
    res.render('../views/client/board/normal1/board.html', {boardData:boardData, boardConfig:boardConfig[0]});
});

router.get('/:code/read/:idx', urlencodedParser, async (req, res)=>{
    var code = req.params.code;
    var idx = req.params.idx;

    var boardData = await knex('board_data_'+code).select().where({bod_idx:idx});
    var boardConfig = await knex('board_config').where({'boc_code':code});

    console.log(boardData);
    console.log(boardConfig);
    console.log(code);
    res.status(200).json('글 읽기');
});

router.get('/:code/write', urlencodedParser, (req, res)=>{
    var code = req.params.code;

    res.render('../views/client/board/normal1/write.html');
});

router.post('/:code/write', urlencodedParser, async (req, res)=>{
    var code = req.params.code;

    var title = req.body.board_title;
    var content = req.body.board_content;

    await knex('board_data_'+code).insert({
        'bod_usr_name':req.session.usr_name,
        'bod_usr_idx':req.session.usr_idx,
        'bod_title':title,
        'bod_content':content,
        'bod_created_at':new Date(),
    },['bod_idx']);

    res.status(200).json('저장 되었습니다.');
});

module.exports = router;