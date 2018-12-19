var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var template = require('art-template');
var app = express();

// 视图引擎设置
template.config('base', '');
template.config('extname', '.html');
template.config('encoding', 'utf-8');
template.config('cache', false);
template.config('openTag', '[[');
template.config('closeTag', ']]');

app.engine('.html', template.__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// app.use(favicon(path.join(__dirname, 'build', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));

// app.all('*', function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "http://localhost:8080");
//     // res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//     res.header("X-Powered-By",' 3.2.1')
//     // res.header("Content-Type", "application/json;charset=utf-8");
//     next();
//  });

//路由配置
app.use('/', require('./routes/HomeRoute'));

// app.use('/edge', require('./routes/ThreeLoginRoute'));
// app.use('/menu', require('./routes/manager/MenuRoute'));
// app.use('/', require('./routes/manager/ShopRoute'));



if (process.env.NODE_USER) {
  // logger.info("run as "+process.env.NODE_USER);
  process.setuid(process.env.NODE_USER);
}


process.on("uncaughtException", function (err) {

  //系统级异常监控
  // logger.error('进程异常:',err.message + "\n\n" + err.stack + "\n\n" + err.toString());

  setTimeout(function () {
    process.exit(1);
  }, 5000);

});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    // logger.warn({req:req},res.status);//异常页面监控
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  // logger.warn({req:req},res.status);//异常页面监控
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
