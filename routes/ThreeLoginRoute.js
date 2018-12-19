var express = require('express');
var router = express.Router();
var request = require('request');
var getAuthConf = require('./util/getAuthConf');
var conf=getAuthConf();
var serverConf = require('./util/getServerConf').getServerSyncConf();//默认读取一次配置文件

var dateV=new Date();
var timeStamp= 'v='+dateV.getFullYear()+(dateV.getMonth()+1)
    +dateV.getDate()+dateV.getHours()+dateV.getMinutes();
/**
 * 第三方登录
 * 第一步 类型分发
 * QQ SINA WEIXIN
 * @param request
 * @param response
 * @param op
 * @throws Exception
 * @success
 */
router.get('/openid/before_bind', function(req, res, next) {

    var op=req.query.op;
    var url=[];//拼接URL

        if('qq'===op){

            url.push(conf['meirong.login.qq.uri']+'/');
            url.push(conf['meirong.login.qq.ovar']+'/authorize?');
            url.push('response_type=code&state=qq&client_id=');
            url.push(conf['meirong.login.qq.appid']+'&');
            url.push('redirect_uri='+conf['meirong.login.qq.callback.uri']);

            console.log('qq =====url::',url.join(''));

            res.redirect(url.join(''));
        }else if('sina'==op){

            url.push(conf['meirong.login.sina.uri']+'/');
            url.push(conf['meirong.login.sina.ovar']+'/authorize?');
            url.push('response_type=code&state=sina&client_id=');
            url.push(conf['meirong.login.sina.appid']+'&');
            url.push('redirect_uri='+conf['meirong.login.sina.callback.uri']);
            console.log('sina ======url::',url.join(''));

            res.redirect(url.join(''));
        }else if('weixin'==op){

            url.push(conf['meirong.login.weixin.uri']+'?');
            url.push('appid='+conf['meirong.login.weixin.appid']+'&');
            url.push('redirect_uri='+conf['meirong.login.weixin.callback.uri']+'&');
            url.push('response_type=code&scope=snsapi_login&state=#wechat_redirect');
            console.log('weixin ====url::',url.join(''));

            res.redirect(url.join(''));
        }else{
            //异常（未实现的外部登录）
            console.error('/openid/before_bind , param is error op:',op);
            res.redirect('/#login');
        }

});

/**
 * 扣扣登录第二步
 * @param request
 * @param response
 * @param code
 * @param state
 * @return
 * @throws Exception
 * @success
 */

router.get('/callback/qq', function(req, res, next) {

    var code=req.query.code,
        state=req.query.state,
        url=[];//带拼接参数(GET)

        url.push(conf['meirong.login.qq.uri']+'/');
        url.push(conf['meirong.login.qq.ovar']+'/token');
        url.push('?grant_type=authorization_code&client_id=');
        url.push(conf['meirong.login.qq.appid']+'&');
        url.push('client_secret='+conf['meirong.login.qq.appkey']+'&');
        url.push('code='+code+'&');
        url.push('redirect_uri='+conf['meirong.login.qq.callback.uri']);
        url=url.join('');
        console.log('第二步QQ',url);


    // 服务器端发送REST请求
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //成功

            console.log('QQ login callback:',body);
            var accessToken=getUrlKey('access_token',body);

            console.log('QQ login callback access_token :',accessToken);
            console.log('QQ login callback expires_in :',getUrlKey('expires_in',body));
            console.log('QQ login callback refresh_token :',getUrlKey('refresh_token',body));
            //跳入中转页面
            if(!accessToken){
                res.redirect('/#login');
                console.log('QQ 登录错误消息:',body);
            }else{

                getQqOpenId(accessToken,function(err,data){

                    if(!err){
                        console.log('QQ getQqOpenId:',data);

                        var openid='';
                        var str=data.substring(data.indexOf('{'),data.indexOf('}')+1);
                        try{
                            openid= JSON.parse(str).openid;
                        }catch(e){
                            console.log('getQqOpenId数据截取 错误消息:',data,str);
                            res.redirect('/#login');
                        }

                        res.render('login/mljia_three_login',
                            {
                                accessToken: accessToken,
                                openId: openid,//需要另外获取
                                from : 'qq',
                                confRoot : serverConf.confRoot,
                                wxRoot : serverConf.wxRoot,
                                myRoot : serverConf.myRoot,
                                mainUrl: serverConf.mainUrl,
                                libVersion : serverConf.libVersion,
                                fileVersion : timeStamp || serverConf.fileVersion,
                                staticCss_Url: serverConf.staticCssUrl,
                                resourcesUrl: serverConf.resourcesUrl,
                                staticImage_Url: serverConf.staticImageUrl
                            });

                    }else{
                        console.log('getQqOpenId错误消息:',err);
                        res.redirect('/#login');
                    }
                });
            }
        }else{
            res.redirect('/#login');
        }
    });

});

/**
 * 新浪登录第二步
 * @param request
 * @param response
 * @param code
 * @param state
 * @return
 * @throws Exception
 * @success
 */
var ins=0;

router.get('/callback/sina', function(req, res, next) {



    var code=req.query.code,
        state=req.query.state,
        url=[];//带拼接
    ins++;
    console.log('===第:'+ins+' 次');

        url.push(conf['meirong.login.sina.uri']+'/');
        url.push(conf['meirong.login.sina.ovar']+'/access_token');
        url=url.join('');
        console.log('第二步sina',url);

    // 服务器端发送REST请求
    request.post(url,{form:{
        grant_type: "authorization_code",
        client_id: conf['meirong.login.sina.appid'],
        client_secret: conf['meirong.login.sina.appkey'],
        code: code,
        redirect_uri: conf['meirong.login.sina.callback.uri']
    }}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var backObj=JSON.parse(body);

            var accessToken=backObj['access_token'];
            var openId=backObj['uid'];

            console.log('sina login callback access_token :',accessToken);
            console.log('sina login callback expires_in :',backObj['expires_in']);
            console.log('sina login callback refresh_token :',openId);

            if(!accessToken){
                console.log('异常数据：',body);
                res.redirect('/#login');

            }else{
                //跳入中转页面
                res.render('login/mljia_three_login',
                    {
                        accessToken: accessToken,
                        openId: openId,
                        from : 'sina',
                        confRoot : serverConf.confRoot,
                        wxRoot : serverConf.wxRoot,
                        myRoot : serverConf.myRoot,
                        mainUrl: serverConf.mainUrl,
                        libVersion : serverConf.libVersion,
                        fileVersion : timeStamp || serverConf.fileVersion,
                        staticCss_Url: serverConf.staticCssUrl,
                        resourcesUrl: serverConf.resourcesUrl,
                        staticImage_Url: serverConf.staticImageUrl
                    });
            }

        }else{
            res.send(response+body);
            //res.redirect('/#login');
        }
    });
});
/**
 * 	微信登录入口 第二步
 *  通过code获取access_token
 * @param request
 * @param response
 * @param code
 * @param state
 * @return
 * @throws Exception
 * @success
 */
router.get('/callback/weixin', function(req, res, next) {



    var code=req.query.code,
        state=req.query.state,
        url=[];//带拼接

    url.push(conf['meirong.login.weixin.uri2']+'/');
    url.push(conf['meirong.login.weixin.ovar']+'/access_token');
    url.push('?appid='+conf['meirong.login.weixin.appid']+'&');
    url.push('secret='+conf['meirong.login.weixin.appkey']+'&');
    url.push('code='+code+'&');
    url.push('grant_type=authorization_code');
    url=url.join('');
    console.log('第二步weixin',url);

    // 服务器端发送REST请求
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //成功
            var backObj=JSON.parse(body);
            var accessToken=backObj['access_token'];
            var openId=backObj['openid'];
            var unionid=backObj['unionid'];

            console.log('weixin login callback access_token :',accessToken);
            console.log('weixin login callback expires_in :',backObj['expires_in']);
            console.log('weixin login callback refresh_token :',backObj['refresh_token']);
            console.log('weixin login callback openid :',openId);
            console.log('weixin login callback unionid :',unionid);
            //跳入中转页面
            if(!accessToken){
                res.redirect('/#login');

                console.log('异常数据：',body);
            }else{
                res.render('login/mljia_three_login',
                    {
                        accessToken: accessToken,
                        openId: unionid,
                        wxopenId: openId,
                        from : 'weixin',
                        confRoot : serverConf.confRoot,
                        wxRoot : serverConf.wxRoot,
                        myRoot : serverConf.myRoot,
                        mainUrl: serverConf.mainUrl,
                        libVersion : serverConf.libVersion,
                        fileVersion : timeStamp || serverConf.fileVersion,
                        staticCss_Url: serverConf.staticCssUrl,
                        resourcesUrl: serverConf.resourcesUrl,
                        staticImage_Url: serverConf.staticImageUrl
                    });
            }
        }else{
            res.redirect('/#login');
        }
    });

});

/**
 * 新浪登录 取消回调
 * @param request
 * @param response
 * @param source
 * @param uid
 * @param auth_end
 * @return
 * @throws Exception
 */

router.get('/callback/sina/cancel', function(req, res, next) {

    res.redirect('/#login');
});

/**
 * 获取扣扣登录用户的openId
 * @param accessToken
 * @return
 * @throws IOException
 */
function getQqOpenId(accessToken,fn){
    var url=[];

    url.push(conf['meirong.login.qq.uri']+'/');
    url.push(conf['meirong.login.qq.ovar']+'/me');
    url.push('?access_token='+accessToken);

    url=url.join('');

    console.log('获取扣扣登录用户的openId',url);

    // 服务器端发送REST请求
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //成功
            if(fn && typeof fn==='function'){
                fn(null,body);
            }
        }else{
            fn(error);
        }
    });

}

/**
 * 获取扣扣用户信息
 * @param accessToken
 * @param appKey
 * @return
 * @throws IOException
 * @success
 */
function getQqUserInfo(accessToken, openid,fn){

    var url=[];
    url.push(conf['meirong.login.qq.uri']);
    url.push(conf['meirong.login.qq.userinfo']+'?');
    url.push('access_token='+accessToken+'&');
    url.push('oauth_consumer_key='+conf['meirong.login.qq.appid']+'&');
    url.push('openid='+openid);

    url=url.join('');

    console.log('获取扣扣用户信息:',url);
    // 服务器端发送REST请求
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //成功
            if(fn && typeof fn==='function'){
                fn(null,body);
            }
        }else{
            fn(error);
        }
    });

}

/**
 * 获取新浪用户UID
 * @param accessToken
 * @return
 * @throws IOException
 */

function getSinaUid(accessToken ,fn){

    var url=[];
    url.push(conf['meirong.login.sina.uri']+'/2/account/get_uid.json?');
    url.push('access_token='+accessToken);
    url=url.join('');

    // 服务器端发送REST请求
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //成功
            if(fn && typeof fn==='function'){
                fn(null,body);
            }
        }else{
            fn(error);
        }
    });
}

/**
 * 获取新浪用户信息
 * @param accessToken
 * @return
 * @throws IOException
 */

function  getSinaUserInfo(accessToken,uid,fn){

    var url=[];

    url.push(conf['meirong.login.sina.uri']);
    url.push(conf['meirong.login.sina.userinfo']+'?');
    url.push('access_token='+accessToken+'&');
    url.push('uid='+uid);
    url=url.join('');

    // 服务器端发送REST请求
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //成功
            if(fn && typeof fn==='function'){
                fn(null,body);
            }
        }else{
            if(fn && typeof fn==='function'){
                fn(error);
            }
        }
    });
}

/**
 * 微信信息查询
 * @param accessToken
 * @param openId
 * @return
 * @throws IOException
 */

function  getWeixinUserInfo(accessToken,openId,fn){

    //检查accessToken 有效性
    //checkedWeixinInfo(accessToken, openId,function(err,data){
    //    if(!err){
    //               console.log('checkedWeixinInfo 有效性 数据返回 :',data);
    //
    //
    //    }
    //});

    var url=[];

    url.push(conf['meirong.login.weixin.uri2']);
    url.push(conf['meirong.login.weixin.userinfo']+'?');
    url.push('access_token='+accessToken+'&');
    url.push('openid='+openId);
    url=url.join('');

    // 服务器端发送REST请求
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //成功
            if(fn && typeof fn==='function'){
                fn(null,body);
            }
        }else{
            fn(error);
        }
    });


}
/**
 * 检查 微信接口  accessToken 的有效性
 * @param accessToken
 * @return
 * @throws IOException
 */
function checkedWeixinInfo(accessToken, openId,fn){

    var url=[];

    url.push(conf['meirong.login.weixin.uri2']+'/auth?');
    url.push('access_token='+accessToken+'&');
    url.push('openid='+openId);
    url=url.join('');

    // 服务器端发送REST请求
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //成功
            if(fn && typeof fn==='function'){
                fn(null,body);
            }
        }else{
            fn(error);
        }
    });

}


/**
 * 第三方登录未注册中转页面
 * @param request
 * @param response
 * @param model
 * @param openId
 * @param wxopenId
 * @param access
 * @param op
 * @return
 * @throws Exception
 */
router.get('/register', function(req, res, next) {
    var serverConf = require('./util/getServerConf').getServerSyncConf();

    var openId=req.query.openId,
        wxopenId=req.query.wxopenId,
        accessToken=req.query.access,
        op=req.query.op,
        upload_url=serverConf['meirong.upload.remotely.url'];//远程文件上传

    if('qq'===op){
        getQqUserInfo(accessToken, openId,function(err,data){

            if(err){
                res.redirect('/#login');
            }
           console.log('获取qq用户的数据：',data);
            var qqObj=JSON.parse(data);
            //拼装数据

            upload_image(upload_url,  qqObj['figureurl_2'],  '来自QQ头像',function(error,data2){

                console.log('获取qq用户图片的数据：',error,data2);
                var imgObj=!!data2 ? JSON.parse(data2):{};
                 var item={
                     accessToken: accessToken,
                     openId: openId,
                     wxopenid: wxopenId,
                     from :op,
                     userFlag : 0,
                     loginName: openId,
                     userOtherName:qqObj.nickname,
                     userSex: qqObj.gender==='男' ? 0 :1,
                     userImages: (!!imgObj.data && imgObj.status==200) ? imgObj.data.id :0
                 };

                res.render('login/mljia_three_register',
                    {
                        accessToken: accessToken,
                        openId: openId,
                        wxopenid: wxopenId,
                        from : op,
                        item: item,
                        confRoot : serverConf.confRoot,
                        wxRoot : serverConf.wxRoot,
                        myRoot : serverConf.myRoot,
                        mainUrl: serverConf.mainUrl,
                        itemStr: JSON.stringify(item),
                        libVersion : conf.libVersion,
                        fileVersion : serverConf.fileVersion,
                        staticCss_Url: serverConf.staticCssUrl,
                        resourcesUrl: serverConf.resourcesUrl,
                        staticImage_Url: serverConf.staticImageUrl
                    });

            });
        });

    }else if('sina'===op){

        getSinaUserInfo(accessToken,openId,function(err,data){
            if(err){
                res.redirect('/#login');
            }
            console.log('获取sina用户的数据：',data);
            var sinaObj=JSON.parse(data);
            //拼装数据
            upload_image(upload_url,  sinaObj['profile_image_url'],  '来自sina头像',function(error,data2){

                console.log('获取qq用户图片的数据：',error,data2);
                var imgObj=!!data2 ? JSON.parse(data2):{};
                var item={
                    accessToken: accessToken,
                    openId: openId,
                    wxopenid: wxopenId,
                    from :op,
                    userFlag : 1,
                    loginName: openId,
                    userOtherName:sinaObj.name,
                    userSex: sinaObj.gender==='m' ? 0 :1,
                    userImages: (!!imgObj.data && imgObj.status==200) ? imgObj.data.id :0
                };

                res.render('login/mljia_three_register',
                    {
                        accessToken: accessToken,
                        openId: openId,
                        wxopenid: wxopenId,
                        from : op,
                        item: item,
                        confRoot : serverConf.confRoot,
                        wxRoot : serverConf.wxRoot,
                        myRoot : serverConf.myRoot,
                        mainUrl: serverConf.mainUrl,
                        itemStr: JSON.stringify(item),
                        libVersion : conf.libVersion,
                        fileVersion : serverConf.fileVersion,
                        staticCss_Url: serverConf.staticCssUrl,
                        resourcesUrl: serverConf.resourcesUrl,
                        staticImage_Url: serverConf.staticImageUrl
                    });

            });

        });

    }else if('weixin'===op){
        getWeixinUserInfo(accessToken, openId,function(err,data){
            if(err){
                res.redirect('/#login');
            }
            console.log('获取 weixin 用户的数据：',data);
            var weixinObj=JSON.parse(data);
            // sex获取用户性别，1 男，2 女

            //拼装数据
            upload_image(upload_url,  weixinObj['profile_image_url'],  '来自weixin头像',function(error,data2){

                console.log('获取 weixin 用户图片的数据：',error,data2);
                var imgObj=!!data2 ? JSON.parse(data2):{};
                var item={
                    accessToken: accessToken,
                    openId: openId,
                    wxopenid: wxopenId,
                    from : op,
                    userFlag : 1,
                    loginName: openId,
                    userOtherName: weixinObj.nickname,
                    userSex: weixinObj.sex==='1' ? 0 :1,
                    userImages: (!!imgObj.data && imgObj.status==200) ? imgObj.data.id :0
                };

                res.render('login/mljia_three_register',
                    {
                        accessToken: accessToken,
                        openId: openId,
                        wxopenid: wxopenId,
                        from : op,
                        item: item,
                        confRoot : serverConf.confRoot,
                        wxRoot : serverConf.wxRoot,
                        myRoot : serverConf.myRoot,
                        mainUrl: serverConf.mainUrl,
                        itemStr: JSON.stringify(item),
                        libVersion : conf.libVersion,
                        fileVersion : serverConf.fileVersion,
                        staticCss_Url: serverConf.staticCssUrl,
                        resourcesUrl: serverConf.resourcesUrl,
                        staticImage_Url: serverConf.staticImageUrl
                    });

            });

        });
    }else{
        res.redirect('/#login');
    }

});

/**
 * 三方登录 第三步，获取用户信息 (注册用)
 * @param type 1=QQ接入 2=SINA接入 3 微信接入 时候 openId !=null
 * @param accessToken
 * @return
 */

function  getUserMessage(type, accessToken, openId, fn){
    if (type == 1) {
        getQqUserInfo(accessToken, openId,function(err,data){

            if(fn && typeof fn==='function'){
                    fn(err,data);
            }
        });
    } else if (type == 2) {
        getSinaUserInfo(accessToken,function(err,data){

            if(fn && typeof fn==='function'){
                fn(err,data);
            }

        });
    } else if (type == 3) {
        getWeixinUserInfo(accessToken, openId,function(err,data){

            if(fn && typeof fn==='function'){
                fn(err,data);
            }

        });
    } else {
        if(fn && typeof fn==='function'){
            fn('type 类型错误');
        }
    }

}


/**
 * 上传   第三方登录获取的用户头像
 * @param upload_url
 * @param image_url
 * @param src_name
 * @return
 * @throws IOException
 */
function  upload_image(upload_url,  image_url,  src_name,fn){

    if(!image_url || !upload_url){
        if(fn && typeof fn==='function'){
            fn('image_url 为空');
        }
        return;
    }

    request.post(upload_url,{form:{
            url: image_url
        }
    },function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //成功
            if(fn && typeof fn==='function'){
                fn(null,body);
            }
        }else{
            fn(error);
        }
    });

}


function getUrlKey(name,str){
    if(!str){
        return null;
    }
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    //substr(1)
    var result = str.match(reg);
    if(result != null){
        return result[2];
    }else{
        return null;
    }
};



module.exports = router;
