const express = require('express');
const router = express.Router();
const knex = require('../../config/dbConn');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/:code', urlencodedParser, async (req, res)=>{
    var code = req.params.code;

    var search_cond = req.query.search_cond;
    var search_word = '';
    var boardData_data = '';
    req.query.search_word==undefined?search_word='':search_word='%'+req.query.search_word+'%';

    var reqData = req.query;
    var pagination = {};
    var per_page = reqData.per_page || 10;
    var page = reqData.current_page || 1;
    if (page < 1) page = 1;
    var offset = (page - 1) * per_page;

    switch(req.query.search_cond){
        case undefined:
            search_cond = undefined;
            break;
        case 'writer':
            search_cond = 'bod_usr_name';
            break;
        case 'title':
            search_cond = 'bod_title';
            break;
        case 'content':
            search_cond = 'bod_content';
            break;
    }
    
    var boardConfig = await knex('board_config').where({'boc_code':code});

    Promise.all([
        knex('board_data_'+code).count('* as count').first().modify(function(boardData) {
            if (req.query.search_cond!=undefined) {
                boardData.where(search_cond,'like',search_word);
            }
        }),
        knex('board_data_'+code).select().offset(offset).limit(per_page).orderBy('bod_created_at','desc').modify(function(boardData) {
            if (req.query.search_cond!=undefined) {
                boardData.where(search_cond,'like',search_word);
            }
        })
    ]).then(([total, rows]) => {
        var count = total.count;
        var rows = rows;
        pagination.total = count;
        pagination.per_page = per_page;
        pagination.offset = offset;
        pagination.to = offset + rows.length;
        pagination.last_page = Math.ceil(count / per_page);
        pagination.current_page = page;
        pagination.from = offset;
        pagination.data = rows;

        pagination.startPage = ((page - 1) / 10) * 10 + 1;

        pagination.endPage = pagination.startPage + 10 - 1;

        boardData_data = pagination;

        console.log(boardData_data);

        res.render('../views/client/board/normal1/board.html', {boardData:boardData_data, boardConfig:boardConfig[0]});
    });


    // await knex('board_data_'+code).select().orderBy('bod_created_at','desc').modify(function(boardData) {
    //     if (req.query.search_cond!=undefined) {
    //         boardData.where(search_cond,'like',search_word);
    //     }
    // })   
    // .then(function (boardData) {
    //     boardData_arr = boardData
    // });
});

router.get('/:code/read/:idx', urlencodedParser, async (req, res)=>{
    var code = req.params.code;
    var idx = req.params.idx;

    var boardData = await knex('board_data_'+code).select().where({bod_idx:idx});
    var boardConfig = await knex('board_config').where({'boc_code':code});

    res.render('../views/client/board/normal1/read.html',{boardData:boardData[0], boardConfig:boardConfig[0]});
});

router.get('/:code/write', urlencodedParser, (req, res)=>{
    var code = req.params.code;

    res.render('../views/client/board/normal1/write.html');
});

router.get('/:code/edit/:idx', urlencodedParser, async (req, res)=>{
    var code = req.params.code;
    var idx = req.params.idx;

    var boardData = await knex('board_data_'+code).select().where({bod_idx:idx});
    //var boardConfig = await knex('board_config').where({'boc_code':code});

    res.render('../views/client/board/normal1/edit.html',{boc_code:code, bod_idx:idx, boardData:boardData[0]});
});


router.post('/:code/write', urlencodedParser, async (req, res)=>{
    var code = req.params.code;

    var title = req.body.board_title;
    var content = req.body.board_content;

    await knex('board_data_'+code).insert({
        'bod_usr_name':req.session.user.usr_name,
        'bod_usr_idx':req.session.user.usr_idx,
        'bod_title':title,
        'bod_content':content,
        'bod_created_at':new Date(),
    },['bod_idx']);

    res.redirect('/board/'+code);
});

// 게시판 수정
router.post('/:code/edit/:idx', urlencodedParser, async (req, res)=>{
    var code = req.params.code;
    var idx = req.params.idx;

    var boardData = await knex('board_data_'+code).where({bod_idx:idx}).update({
        bod_title : req.body.board_title,
        bod_content : req.body.board_content,
        bod_updated_at : new Date(),
      });
    //var boardConfig = await knex('board_config').where({'boc_code':code});

    res.status(200).json('수정 되었습니다.');
});


module.exports = router;