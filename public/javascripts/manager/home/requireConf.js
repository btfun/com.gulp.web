(function(factory,win,fn){
  fn(factory(),win);
})(function(){
'use strict';
//控制台输入 logPath('123456','searchKeys')查看对应的链接1231231
 return {
   //////////////////lib//////////////////////
   text:        'javascripts/lib/requireJS/requireJS-text',
   vue:         'javascripts/lib/vue/vue.min',
   vueRouter:   'javascripts/lib/vue/vue-router/vue-router',
   vueResource: 'javascripts/lib/vue/vue-resource/vue-resource',
   axios:       'javascripts/lib/vue/axios.min',
   qs:          'javascripts/lib/vue/qs.min',
   md5:          'javascripts/lib/md5',
   rsaBig:       'javascripts/lib/safe/rsa-big',
   vuex:        'javascripts/lib/vue/vuex/vuex.min',
   ELEMENT:     'javascripts/lib/element/element.min',
   echarts:     'javascripts/lib/echarts/echarts.common.min',
   async:       'javascripts/lib/async.min',
   vueQrcode:   'javascripts/lib/vue/vue-qrcode.min',
   cropper:     'javascripts/lib/cropper.min',
   iNotify:     'javascripts/lib/iNotify.min',
   socketIO:     'javascripts/lib/socket.io',
   jquery:       'javascripts/lib/jquery.min',
   moment:       'javascripts/lib/moment',
   cookiebase64: 'javascripts/lib/cookie.base64.min',
   //base
   globalUri:   'javascripts/base/globalUri',
   loginUri:   'javascripts/base/loginUri',
   globalUtil:  'javascripts/base/globalUtil',
   //////////////////主入口/////////////////////
   mainHomeIndex:   'javascripts/manager/home/homeIndex',
   routerIndex: 'javascripts/manager/home/homeRouter',
   mainHomeElectron:'javascripts/manager/mainElectron',
   //////////////////组件入口1///////////////////
   home:{
     indexModule:      'components/manager/home/pages/index/indexModule',
     indexTmpl:        'components/manager/home/pages/index/indexHtml',
   }

 };


},this||window,function(pathMods,win){
  'use strict';
  //pathMods 层级对象抹平，最多支持三级对象属性
  var path={};
  for(let attr in pathMods){
    if(typeof pathMods[attr]==='string'){
      path[attr]=pathMods[attr];
    }else if(typeof pathMods[attr]==='object'){
        for(let att in pathMods[attr]){
            if(typeof pathMods[attr][att]==='object' ){
                  for(let at in pathMods[attr][att]){
                    path[attr+'.'+att+'.'+at]=pathMods[attr][att][at];
                    if(typeof pathMods[attr][att][at]==='object')return alert('警告require配置对象不能有三级对象属性');
                  }
            }else{
              path[attr+'.'+att]=pathMods[attr][att];
            }
        }
    }
  }

 

  if(typeof define !== 'undefined' && define.amd){
    //浏览器
    win.requirejs.config({
      baseUrl:  GLOBAL.resourcesUrl||'/',
      //urlArgs: GLOBAL.version,
      paths: path
    });
    win.require(['mainHomeIndex']);//这里的不能被替换MD5后缀
  }else if(typeof module !== 'undefined' && module.exports){
    //node环境
    module.exports=path;
  }

  win.logPath=function(pwd,conf){
      if(pwd!==123456)return;
      for(var ins in path){
        if(conf){
          if(ins.indexOf(conf)>-1)console.log(ins,':',path[ins]);
        }else{
          console.log(ins,':',path[ins]);
        }
      }
    }
});
