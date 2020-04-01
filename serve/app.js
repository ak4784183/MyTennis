const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors=require('cors');
const formidable=require('formidable');
const mongoose=require('mongoose');
const MongoStore=require('connect-mongo');

const app = express();
app.set('SECRET','wangqiujulebu');

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/uploads',express.static(__dirname+'/uploads'));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(session({
//   secret:"666",
//   store:new MongoStore({
//     url:"mongodb://localhost/tennis"
//   })
// }))
mongoose.connect("mongodb://localhost/tennis",{
  useNewUrlParser:true,
  useFindAndModify:true,
  useCreateIndex:true,
  useUnifiedTopology: true
})
mongoose.connection.on('open',()=>{
  console.log("http://localhost:5000");
})

require('require-all')({
  dirname: __dirname + '/model',
})

require('./routes/index')(app);
require('./routes/rest')(app);
require('./routes/upload')(app);

// 移动端接口
require('./routes/mobile/login')(app)
require('./routes/mobile/index')(app)
require('./routes/mobile/rest')(app)
// 错误处理机制
app.use(async(err,req,res,next)=>{
  res.status(err.statusCode || 500).send({
      message:err.message
  })
})

app.listen(5000);
module.exports = app;
