(function(global,factory){
  'use strict';
  // typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(global) :
  // typeof define === 'function' && define.amd ? define(factory(global)) :
  // (global.report = factory(global));
  factory(global)
})(window,function(global){
  'use strict';

      /*
      *  默认上报的错误信息
      */
     var defaults = {
         t:'',	//发送数据时的时间戳
         l:'ERROR',//js日志错误级别，如warning, error, info, debug
         msg:'',  //错误的具体信息,
         a:navigator.appVersion,
         data:{}
     };

     /*
      *格式化参数
      */
     function formatParams(data) {
         var arr = [];
         for (var name in data) {
             arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
         }
         return arr.join("&");
     }
     /*
      * 上报函数
      */
    var url='/';//错误上报地址
     function report(data){
      //  console.log('******************************************',data)
         var img = new Image();
         img.alt = 'report',
         img.src = url+'?v=1&' +formatParams(data) ;
     }



     window.report=function(param){
       defaults.data=JSON.stringify({
           pageUrl:location.href
       });
       defaults.t=new Date().getTime();
       defaults.level='error';
       // 合并上报的数据，包括默认上报的数据和自定义上报的数据
       var reportData=Object.assign(defaults,param||{});
        report(reportData)
     };

     /**
      * js错误监控
      **/
         //监控资源加载错误(img,script,css,以及jsonp)
         window.addEventListener('error',function(e){
           console.error('---',e)
             defaults.t =new Date().getTime();
             if('img'==e.target.localName){
               defaults.msg =e.target.localName+' is load error, alt is '+e.target.alt;
             }else{
               defaults.msg =e.target.localName+' is load error';
             }
             defaults.data = JSON.stringify({
                target: e.target.localName,
                type: e.type,
                resourceUrl:e.target.currentSrc,
                pageUrl:location.href,
                category:'resource'
            });
             if(e.target!=window){//抛去js语法错误
                 // 合并上报的数据，包括默认上报的数据和自定义上报的数据
                //  var reportData=Object.assign({},params.data || {},defaults);
                 var reportData=Object.assign({}, defaults);
                 // 把错误信息发送给后台
                 report(reportData)
             }


         },true);

         //监控js错误
         window.onerror = function(msg,_url,line,col,error){

             //采用异步的方式,避免阻塞
             setTimeout(function(){
               try {
                 console.error(msg,_url,line,col,error)   
               } catch (e) {
                 console.error(e)
               }


                 //不一定所有浏览器都支持col参数，如果不支持就用window.event来兼容
                 col = col || (window.event && window.event.errorCharacter) || 0;
                 if (error && error.stack){
                     //msg信息较少,如果浏览器有追溯栈信息,使用追溯栈信息
                     defaults.msg = error.stack.toString();

                 }else{
                     defaults.msg = msg;
                 }
                 defaults.data=JSON.stringify({
                     resourceUrl:_url,
                     pageUrl:location.href,
                     category:'js error',
                     line:line,
                     col:col
                 });
                 defaults.t=new Date().getTime();
                 defaults.level='error';
                 // 合并上报的数据，包括默认上报的数据和自定义上报的数据
                //  var reportData=Object.assign({},params.data || {},defaults);
                 var reportData=Object.assign({}, defaults);
                 // 把错误信息发送给后台
                 report(reportData)
             },0);

             return true;   //错误不会console浏览器上,如需要，可将这样注释
         };


});
