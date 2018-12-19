var Redis = require("ioredis");
var path = require('path');
var fs= require('fs');
var stripJsonComments = require('strip-json-comments');
var bunyan = require('bunyan');
var logger = bunyan.createLogger({name: "saas.beauty.web"});

// var emailUtil = require('./emailUtil');

var authRedis,authRedis2;
var LOGIN_AUTH_INFO='s:login_auth:{{token}}';

getRedisConf(function(obj){

    if(!obj) return;

    var host=obj['redis.group.client1.host'];
    var port=obj['redis.group.client1.port'];
    var timeout=obj['redis.group.client1.timeout'];
    var password=obj['redis.group.client1.password'];

    var host2=obj['redis.group.client2.host'];
    var port2=obj['redis.group.client2.port'];
    var timeout2=obj['redis.group.client2.timeout'];
    var password2=obj['redis.group.client2.password'];

    authRedis = new Redis(port, host, { password: password });
    authRedis2 = new Redis(port2, host2, { password: password2 });

    authRedis.on('error', function (err) {
        logger.error('[%s] [master:%s] wroker exit: %s', Date(), process.pid,' redis concat Error :'+err);
    });

    authRedis.on('end', function (err) {
        logger.error('[%s] [master:%s] wroker exit: %s', Date(), process.pid,' redis concat Error :'+err);
        authRedis=authRedis2;
        // emailUtil.sendMail({
        //     subject : "saas.web 连接redis发生错误 正切换到 "+host2+" [App Server Error]",
        //     text    : err.message + "\n" + err.stack + "\n" + err.toString()
        // });
    });


    authRedis2.on('error', function (err) {
        logger.error('[%s] [master:%s] wroker exit: %s', Date(), process.pid,' redis concat Error :'+err);

    });
    authRedis2.on('end', function (err) {
        logger.error('[%s] [master:%s] wroker exit: %s', Date(), process.pid,' redis concat Error :'+err);
        authRedis2=authRedis;
        // emailUtil.sendMail({
        //     subject : "saas.web 连接redis发生错误 正切换到 "+host+" [App Server Error]",
        //     text    : err.message + "\n" + err.stack + "\n" + err.toString()
        // });
    });

});

function getAccessToken(req,fun){
    var accessToken=req.cookies.access_token;
    if(accessToken && authRedis){
        var token=LOGIN_AUTH_INFO.replace('{{token}}',accessToken);
        authRedis.get(token, function(err, object) {
            if(err){
                logger.error(process.pid,'redis query error:',err);
            }
            fun(err,object);
        });
    }else{
        if(!authRedis){

            logger.error(process.pid,'redis is not contact');
            logger.info(process.pid,'redis is not contact');
            fun('redis is not contact');
        }else{
            fun('accessToken is not exist');
        }
    }
}

function getRedisConf(fn){
    var obj;
    try{
        var json = fs.readFileSync(path.resolve(__dirname, '../../conf/redis.json'),'utf8').toString();
        obj=JSON.parse(stripJsonComments(json));
    }catch(e){
        logger.error('[%s] [master:%s] wroker exit: %s', Date(), process.pid,'getRedisConf auth.json error:'+ e);
    }

    fn(obj);
}

module.exports = getAccessToken;
