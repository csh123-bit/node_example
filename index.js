const express = require('express')
const app = express()
const port = 3000
const admin = require('./routes/admin/admin.js');
const client = require('./routes/client/client.js');
const nunjucks = require('nunjucks');
const knex = require('./config/dbConn');

//12/31일부터 본격적으로 만들기 시작함
nunjucks.configure('views',{
  autoescape : true,
  express : app,
});
// 미들웨어
app.use("/static",express.static(__dirname + "/static"));

app.use('/admin', admin);

app.use('/main', client);

app.get('/', (req, res) => {
    res.redirect('/main');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});