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

router.get('/:code/write', urlencodedParser, async (req, res)=>{
    var code = req.params.code;

    res.render('../views/client/board/normal1/write.html');
});

module.exports = router;