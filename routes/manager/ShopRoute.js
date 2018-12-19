var express = require('express');
var router = express.Router();
var getAccessToken = require('../util/getAccessToken');
var logger=require('../util/logUtil').logger;
var serverConf = require('../util/getServerConf');
var conf=serverConf.getServerSyncConf();//默认读取一次配置文件
var dateV=new Date();
var timeStamp= 'v='+dateV.getFullYear()+(dateV.getMonth()+1)
            +dateV.getDate()+dateV.getHours()+dateV.getMinutes();

/* 工作机登录*/
router.get('/manager/mac', function(req, res, next) {

    res.render('manager/mljia_mac_load',
        {   shopId: req.query.shopId,
            confRoot: conf.confRoot,
            wxRoot: conf.wxRoot,
            staticUrl: conf.staticUrl,
            fileVersion : timeStamp || conf.fileVersion,
            resourcesUrl: conf.resourcesUrl
        });
});
/* 店铺主页 */
router.get('/:shopId', function(req, res, next) {
    serverConf.getServerConf(function(err,objConf){
        //每次进店铺主页异步读取一次配置文件
            if(!err){
                conf=objConf;
            }
    });


    getAccessToken(req,function(err,data){

        if(err){

            res.redirect('/manager/mac?shopId='+(req.path).replace('/',''));
        }else{
            if(data){
                var tokenObj=JSON.parse(data);
                var lts=tokenObj.shopSid.filter(function(item){
                    return ('/'+item)==req.path;
                });
                if(lts.length===0){
                    //非法进入别家店铺
                    res.redirect('/');
                }else{

                    var buf = new Buffer(data),
                        date=new Date(),
                        accessVal = buf.toString('base64'),
                        shopSetting={};
                     for(var attr in tokenObj.shopsSetting){
                       if(attr==lts[0]){
                          shopSetting=tokenObj.shopsSetting[attr];
                         break;
                       }
                     }
                     
                     logger.debug({req:req}, tokenObj)

                     if(tokenObj.shopVersions && tokenObj.shopVersions.length>0){
                       var shopinfo=tokenObj.shopVersions.filter((ite)=>{
                         return  ('/'+ite.shopSid)==req.path;
                       })[0];
                       //非医美跳转
                       if(shopinfo && shopinfo.version!=='P_YM'){
                         return res.redirect(conf.confRoot.replace('saas','o2o')+req.path);
                       }

                     }

                    res.render('manager/shop/mljia_shop_index',
                        {
                            shopId: req.params.shopId,
                            accessObject: accessVal,
                            confRoot : conf.confRoot,
                            wxRoot : conf.wxRoot,
                            fxRoot : conf.fxRoot,
                            myRoot : conf.myRoot,
                            mainUrl: conf.mainUrl,
                            cometRoot: conf.cometRoot,
                            payRoot : conf.payRoot,
                            smsRoot : conf.smsRoot,
                            marketingPayRoot:conf.marketingPayRoot,
                            homeNew: shopSetting.SHOP_HOME_NEW,
                            month: (date.format("yyyy-MM")),
                            today: (date.format("yyyy-MM-dd")),
                            date : (date.format("yyyy-MM-dd hh:mm:ss")),
                            staticUrl: conf.staticUrl,
                            version : timeStamp || conf.fileVersion,
                            resourcesUrl: conf.resourcesUrl,
                            jcropImgUrl: conf["cn.mljia.meirong.jcrop.img.url"],
                            thildZhifubaoPay :conf['cn.mljia.meirong.third.zhifubao.pay'] ,
                            thildWeixinPay :conf['cn.mljia.meirong.third.weixin.pay'] ,
                            downloadUrl: conf['cn.mljia.meirong.download.url'],
                            fileDownloadFile_Url: conf['cn.mljia.meirong.download.file.url'],
                            uploadFile_Url: conf['cn.mljia.meirong.upload.file.url'],
                            uploadImage_Url: conf['cn.mljia.meirong.upload.url']
                        });
                }
            }else{
                res.redirect('/manager/mac?shopId='+(req.path).replace('/',''));
            }
        }
    });
});



/* �店铺内拦截器 */
router.get('/:shopId/*',function(req, res, next){
    getAccessToken(req,function(err,data){
        if(err){

            //logger.info('/:shopId/* access_token is null , going to /manager/mac',err);

            res.redirect('/manager/mac?shopId='+req.params.shopId);
        }else{
            if(data){

                var tokenObj=JSON.parse(data);

                var lts=tokenObj.shopSid.filter(function(item){
                    return item==req.params.shopId;
                });
                if(lts.length===0){
                    //非法进入别家店铺
                    res.redirect('/');
                }else{
                    //�参数传递��
                    res.locals.data=data;
                    next();
                }
            }else{
                res.redirect('/');
            }
        }
    });
});

router.get('/:shopId/shop', function(req, res, next) {
   		var view=req.query.view,
   		routeModel='manager/shop/'+view;

    res.render(routeModel,
        {
            shopId: req.params.shopId,
            confRoot : conf.confRoot,
            wxRoot : conf.wxRoot,
            myRoot : conf.myRoot,
            main_Url: conf.main_Url,
            cometRoot: conf.cometRoot,
            payRoot : conf.payRoot,
            smsRoot : conf.smsRoot,
            date : (new Date().format("yyyy-MM-dd hh:mm:ss")),
            staticUrl: conf.staticUrl,
            version : timeStamp || conf.fileVersion,
            resourcesUrl: conf.resourcesUrl,
        });
});

/* �店铺内路由控制器*/
router.get('/:shopId/layer', function(req, res, next) {


    var buf = new Buffer(res.locals.data),
        tokenObj=JSON.parse(buf),
        date=new Date(),
        accessVal = buf.toString('base64'),
        shopSetting={};
     for(var attr in tokenObj.shopsSetting){
       if(attr === req.params.shopId){
          shopSetting=tokenObj.shopsSetting[attr];
          break;
       }
     }


    res.render('manager/shop/shop_layer_index',
        {
            shopId: req.params.shopId,
            accessObject: accessVal,
            confRoot : conf.confRoot,
            wxRoot : conf.wxRoot,
            myRoot : conf.myRoot,
            main_Url: conf.main_Url,
            cometRoot: conf.cometRoot,
            payRoot : conf.payRoot,
            smsRoot : conf.smsRoot,
            marketingPayRoot:conf.marketingPayRoot,
            homeNew: shopSetting.SHOP_HOME_NEW,
            date : (new Date().format("yyyy-MM-dd hh:mm:ss")),
            staticUrl: conf.staticUrl,
            version : timeStamp || conf.fileVersion,
            resourcesUrl: conf.resourcesUrl,
            thildZhifubaoPay :conf['cn.mljia.meirong.third.zhifubao.pay'] ,
            thildWeixinPay :conf['cn.mljia.meirong.third.weixin.pay'] ,
            fileDownload_Url: conf['cn.mljia.meirong.download.url'],
            fileDownloadFile_Url: conf['cn.mljia.meirong.download.file.url'],
            uploadFile_Url: conf['cn.mljia.meirong.upload.file.url'],
            uploadImage_Url: conf['cn.mljia.meirong.upload.url'],
            uploadImageCrop_Url: conf['cn.mljia.meirong.jcrop.img.url']

        });
});

Function.prototype.method=function(name,fn){
    if(!this.prototype[name]){
        this.prototype[name]=fn;
        return this;
    }
};


if(!Date.prototype.format){
    Date.prototype.format =function(format){
        var o = {
            "M+" : this.getMonth()+1, //month
            "d+" : this.getDate(), //day
            "h+" : this.getHours(), //hour
            "m+" : this.getMinutes(), //minute
            "s+" : this.getSeconds(), //second
            "q+" : Math.floor((this.getMonth()+3)/3), //quarter
            "S" : this.getMilliseconds() //millisecond
        };
        if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
            (this.getFullYear()+"").substr(4- RegExp.$1.length));
        for(var k in o)if(new RegExp("("+ k +")").test(format))
            format = format.replace(RegExp.$1,
                RegExp.$1.length==1? o[k] :
                    ("00"+ o[k]).substr((""+ o[k]).length));
        return format;
    };
}

module.exports = router;
