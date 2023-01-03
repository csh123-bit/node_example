const express = require('express')
const app = express()
const port = 3000
const admin = require('./routes/admin/admin.js');
const client = require('./routes/client/client.js');
const board = require('./routes/client/board.js');
const nunjucks = require('nunjucks');
const knex = require('./config/dbConn');
var session = require('express-session');// db에 저장하던지 메모리에 저장하던지 해서 처리해야함
const FileStore = require('session-file-store')(session);

// 미들웨어
app.use("/static",express.static(__dirname + "/static"));

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store : new FileStore(),
    cookie: {
      maxAge: 24000 * 60 * 60 // 쿠키 유효기간 24시간
    }
  })
);

nunjucks.configure('views',{
  autoescape : true,
  express : app,
});

app.use('/admin', admin);

app.use('/main', client);

app.use('/board', board);

app.get('/', (req, res) => {
    res.redirect('/main');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});