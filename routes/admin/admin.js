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

//게시판 관련 라우팅 분리 필요
router.get('/board', async (req, res)=>{
    var boardList = await knex('board_config').select().orderBy('boc_idx','desc');
    res.render('../views/admin/board.html', {lists:boardList});
});

router.get('/add_board', (req, res)=>{
    res.render('../views/admin/addboard.html');
});

router.get('/add_board/:idx', async (req, res)=>{
    var idx = req.params.idx;
    var result = await knex('board_config').where('boc_idx',idx);
    console.log(result);
    res.render('../views/admin/addboard.html',{result:result[0]});
});

// 게시판 설정 저장
router.post('/board_config', urlencodedParser, async (req, res)=>{
    var board_code = req.body.board_code;
    var board_skin = req.body.board_skin;
    var board_per_page = req.body.board_page;
    var board_name = req.body.board_name;

    knex.schema.hasTable('board_data_'+board_code).then(function(exists) {
        if (!exists) {
          return knex.schema.createTable('board_data_'+board_code, function(t) {
            t.increments('bod_idx').primary();
            t.string('bod_usr_name', 100);
            t.integer('bod_usr_idx').unsigned();
            t.string('bod_usr_email', 100);
            t.string('bod_title', 255);
            t.text('bod_content');
            t.string('bod_category', 100);
            t.integer('bod_grp').unsigned();
            t.integer('bod_step').unsigned();
            t.integer('bod_order').unsigned();
            t.string('bod_created_id', 50);
            t.string('bod_created_ip', 50);
            t.string('bod_created_at', 50);
            t.string('bod_updated_id', 50);
            t.string('bod_updated_ip', 50);
            t.string('bod_updated_at', 50);
            t.string('bod_deleted_id', 50);
            t.string('bod_deleted_ip', 50);
            t.string('bod_deleted_at', 50);
          }).then(async function(){
            var isSuccess = await knex('board_config')
            .insert({boc_code : board_code,
                    boc_skin : board_skin,
                    boc_per_page : board_per_page,
                    boc_name : board_name,
                    boc_created_at : new Date()}, ['boc_idx']);
        
            console.log(isSuccess[0]);
            if(isSuccess[0].boc_idx>0){
                res.status(200).json("저장 되었습니다.");
            }else{
                res.status(200).json("저장실패.");
            }
          });
        }else{
            res.status(200).json("이미 존재하는 게시판 입니다.");
        }
    });    
});

router.post('/board_config/:idx', urlencodedParser, async (req, res)=>{
    var board_code = req.body.board_code;
    var board_skin = req.body.board_skin;
    var board_per_page = req.body.board_page;
    var board_name = req.body.board_name;

    var isSuccess = await knex('board_config')
    .update({boc_code : board_code,
            boc_skin : board_skin,
            boc_per_page : board_per_page,
            boc_name : board_name,
            boc_created_at : new Date()}, ['boc_idx']).where({ boc_idx : req.params.idx,});

    console.log(isSuccess[0]);
    if(isSuccess[0].boc_idx>0){
        res.status(200).json("저장 되었습니다.");
    }else{
        res.status(200).json("저장실패.");
    }

});

router.get('/menu', (req, res)=>{
    

    res.render('../views/admin/menu.html');
});

router.get('/add_menu', (req, res)=>{
    

    res.render('../views/admin/addmenu.html');
});


module.exports = router;