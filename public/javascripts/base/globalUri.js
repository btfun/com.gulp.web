(function(global,factory,GLOBAL){
  'use strict';
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(GLOBAL,global) :
  typeof define === 'function' && define.amd ? define(factory(GLOBAL,global)) :
  (global.requestUrl = factory(GLOBAL,global));
})(window,function(GLOBAL,global){
  'use strict';
/**
 * 仅内部使用（用户登陆后）
 */

 if(typeof GLOBAL !== 'object'){alert('上下文异常');return;}


 var confRoot=GLOBAL.confRoot|| '//saas.mljia.cn/',  //saas接口上下文
     wxRoot=GLOBAL.wxRoot|| '//wx.mljia.cn/',        // 微信接口
     fxRoot=GLOBAL.fxRoot|| '//fx.mljia.cn/',        // 微信接口
     myRoot=GLOBAL.myRoot|| '//mall.mljia.cn/',      //美业商城
     cometRoot=GLOBAL.cometRoot|| '//comet.mljia.cn/',//长链接
     payRoot=GLOBAL.payRoot|| '//pay.mljia.cn/',      //支付
     smsRoot=GLOBAL.smsRoot|| '//sell.mljia.cn/',     //短信营销
     marketingPayRoot=GLOBAL.marketingPayRoot || '//sell.mljia.cn'; //


var requestUri={
 


  }


function readOnlyObject(obj){
  //让对象不可写
  for(var attr in obj){
      if(typeof obj[attr]==='object'){
        readOnlyObject(obj[attr]);
      }else{
        Object.defineProperty(obj,attr,{
          writable:false
        })
      }
  }
}
readOnlyObject(requestUri);

return requestUri;

},GLOBAL);
