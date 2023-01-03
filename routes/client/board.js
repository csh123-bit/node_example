const express = require('express');
const router = express.Router();
const knex = require('../../config/dbConn');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/:code', urlencodedParser, async (req, res)=>{
    var code = req.params.code;
    console.log(code);
    res.sendStatus(200);
});

module.exports = router;