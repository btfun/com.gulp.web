var express = require('express');
var router = express.Router();
var getAccessToken = require('../util/getAccessToken');
var serverConf = require('../util/getServerConf');
var conf=serverConf.getServerSyncConf(); //默认读取一次配置文件
var dateV=new Date();
var timeStamp= '?v='+dateV.getFullYear()+(dateV.getMonth()+1)
    +dateV.getDate()+dateV.getHours()+dateV.getMinutes();

/* 全局拦截器*/
router.get('*',function(req, res, next){
  console.log('=========全局拦截器==========')
    next();

    // getAccessToken(req,function(err,data){
    //     if(err){
    //         res.redirect('/');
    //     }else{
    //         if(data){
    //
    //             var tokenObj=JSON.parse(data);
    //             if(tokenObj.role===2){
    //                 //(店主登录)数据传递
    //                 res.locals.data=data;
    //                 next();
    //             }else{
    //                 res.redirect('/#login');
    //             }
    //         }else{
    //             res.redirect('/#login');
    //         }
    //     }
    // });
});

router.get('/', function(req, res, next) {

  res.render('manager/home/index',{

  })
});

/* 我的美丽加模块 */
router.get('/index', function(req, res, next) {

    var destination=req.query.route?req.query.route.replace('-','/'):'',
        view=req.query.view,
        routeModel=destination ? ('manager/menu/'+destination+'/'+view) : ('manager/menu/'+view);

        //
      	return res.redirect(conf.confRoot.replace('saas','o2o')+'/menu/index?route=app&view=menu_index');


    var buf = new Buffer(res.locals.data);
    var accessVal = buf.toString('base64');

    res.render(routeModel,
        {
            accessObject: accessVal,
            confRoot : conf.confRoot,
            wxRoot : conf.wxRoot,
            myRoot : conf.myRoot,
            mainUrl: conf.mainUrl,
            cometRoot: conf.cometRoot,
            marketingPayRoot:conf.marketingPayRoot,
            staticUrl: conf.staticUrl,
            version : timeStamp || conf.fileVersion,
            resourcesUrl: conf.resourcesUrl,
            fileDownload_Url: conf['cn.mljia.meirong.download.url'],
            uploadImageCrop_Url: conf['cn.mljia.meirong.jcrop.img.url'],
            uploadFile_Url: conf['cn.mljia.meirong.upload.file.url'],
            uploadImage_Url: conf['cn.mljia.meirong.upload.url']
        });
});



module.exports = router;
