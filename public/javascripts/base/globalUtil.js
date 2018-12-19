(function(global,factory){
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) : window.util=factory();
})(this,function(){
'use strict';


/*
权限验证
数据解码
密码验证
XHR请求全局拦截
*/


var util= {
    createUUid: ()=>{
       return Math.random().toString(36).substr(2, 20);
    },
    changeTitle(title){
      if(document && document.querySelector){

        document.querySelector('title').innerHTML=`${title}-美丽加营销管理系统`||'美丽加店铺'
      }
    },
    encode : function(plain, utf8encode) {
      //base64加密
        plain = plain? UTF8.encode(plain) :'';
        plain = code(plain, false, r256, b64, 8, 6);
        return plain + '===='.slice((plain.length % 4) || 4);
    },
    decode : function(coded, utf8decode) {
      //base64解密
        coded = String(coded).split('=');
        var i = coded.length;
        do {--i;
            coded[i] = code(coded[i], true, r64, a256, 6, 8);
        } while (i > 0);
        coded = coded.join('');
        return  utf8decode ? UTF8.decode(coded) : coded;
    },
     completeDate(time1 , time2 , m){
        var diffyear = time2.getFullYear() - time1.getFullYear() ;
        var diffmonth = diffyear * 12 + time2.getMonth() - time1.getMonth() ;
        var diffDay = time2.getDate() - time1.getDate() ;
        return {
          diffyear:diffyear,
          diffmonth:diffmonth,
          diffDay:diffDay
        };
    },
    debounce(fn, delay) {
      //降频函数
      // 定时器，用来 setTimeout
      console.log(1231231)
      var timer,ins=0;
      // 返回一个函数，这个函数会在一个时间区间结束后的 delay 毫秒时执行 fn 函数
      return function(){
        // 保存函数调用时的上下文和参数，传递给 fn
        var context = this
        var args = arguments
        console.log(ins++)
        // 每次这个返回的函数被调用，就清除定时器，以保证不执行 fn
        clearTimeout(timer)
        // 当返回的函数被最后一次调用后（也就是用户停止了某个连续的操作），
        // 再过 delay 毫秒就执行 fn
        timer = setTimeout(function () {
          fn.apply(context, args)
        }, delay||200)
      }

    },isObjectValueEqual(a, b) {
        //判断两个对象是否值相等
        var aProps = Object.getOwnPropertyNames(a);
        var bProps = Object.getOwnPropertyNames(b);
        if (aProps.length != bProps.length) {
            return false;
        }
        for (var i = 0; i < aProps.length; i++) {
            var propName = aProps[i];
            if (a[propName] !== b[propName]) {
                return false;
            }
        }
        return true;
    },checkNumber(num){
      return !Number.isNaN(Number(num))
    },checkPositiveNumber(num){
      return !Number.isNaN(Number(num))? Number(num)>=0 : false;
    },
    clockSubmit : ()=>{
        // 核心
        function Clock() {
          this.timer = null; // 定时器，表示锁是开着的
          this.grapTimer = 2000;
          // 锁定后，2秒钟后解锁
        }
        Clock.prototype.init = function ( grapTimer ) {
            this.grapTimer = grapTimer || this.grapTimer;
            return this.clock();
          }
          // 方法返回 false:锁是开着的，可以提交表单；true:锁是关着的，不可以提交表单；
        Clock.prototype.clock = function () {

          var that = this;

          // 判断定时器是否关闭,定时器不为null,表示锁没有打开
          if ( that.timer != null ) {
            return false;
          } else {
            // 添加定时器，定时器在1000毫秒内是status是关着的。1000毫秒后是再放开status
            that.timer = window.setTimeout( function () {
              //console.log(that.timer);
              that.timer = null;
            }, that.grapTimer );

            return true;
          }
        }
        Clock.prototype.open = function () {

          var that = this;
          that.timer = null;
          window.clearTimeout( that.timer );
        }

        return new Clock();
    },
    getCookie:(c_name)=>{
      if (document.cookie.length>0){
        var c_start=document.cookie.indexOf(c_name + "=");
        if (c_start!=-1){

          c_start=c_start + c_name.length+1;
          var c_end=document.cookie.indexOf(";",c_start);

          if (c_end==-1) c_end=document.cookie.length;

            return unescape(document.cookie.substring(c_start,c_end));
          }
        }
       return "";
    },
    setCookie:(c_name,value,options)=>{
      //根目录设置cookie
      if (typeof options.expires === 'number') {
        var days = options.expires, t = options.expires = new Date();
        t.setTime(+t + days * 864e+5);
      }
      if(location.hostname.indexOf('192.168') > -1){
        options.domain=null;//
      }
      return (document.cookie = [
        encodeURIComponent(c_name), '=', encodeURIComponent(value),
        options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
        options.path    ? '; path=' + options.path : '',
        options.domain  ? '; domain=' + options.domain : '',
        options.secure  ? '; secure' : ''
      ].join(''));

    },
    clearCookie:function(key,domain){
      //clean all cookie
      var keys=document.cookie.match(/[^ =;]+(?=\=)/g);
      if (keys) {
        var options={
          path:'/',
          domain: domain
        };
        if(location.hostname.indexOf('192.168') > -1){
            options.domain=null;//
        }
          for (var i = keys.length; i--;){
            if(key){
              if(key==keys[i]){
                (document.cookie = [
                    encodeURIComponent(key), '=',
                    options.expires ? '; expires=-1' : '',
                    options.path    ? '; path=' + options.path : '',
                    options.domain  ? '; domain=' + options.domain : '',
                    options.secure  ? '; secure' : ''
                ].join(''));
              }
            }else{
              (document.cookie = [
                  encodeURIComponent(key), '=',
                  options.expires ? '; expires=-1': '',
                  options.path    ? '; path=' + options.path : '',
                  options.domain  ? '; domain=' + options.domain : '',
                  options.secure  ? '; secure' : ''
              ].join(''));
            }

          }
      }
    }, ajax(params) {
      params = params || {};
      params.data = params.data || {};
      var json = params.jsonp ? jsonp(params) : json(params);
      // jsonp请求
      function jsonp(params) {
       //创建script标签并加入到页面中
       var callbackName = params.jsonp;
       var head = document.getElementsByTagName('head')[0];
       // 设置传递给后台的回调参数名
       params.data['callback'] = callbackName;
       var data = formatParams(params.data);
       var script = document.createElement('script');
       head.appendChild(script);
       //创建jsonp回调函数
       window[callbackName] = function(json) {
       head.removeChild(script);
       clearTimeout(script.timer);
       window[callbackName] = null;
       params.success && params.success(json);
       };
     　　//发送请求
       script.src = params.url + '?' + data;
       //为了得知此次请求是否成功，设置超时处理
       if(params.time) {
        script.timer = setTimeout(function() {
         window[callbackName] = null;
         head.removeChild(script);
         params.error && params.error({
          message: '超时'
         });
        }, time);
       }
      };
      //格式化参数
      function formatParams(data) {
       var arr = [];
       for(var name in data) {
        arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
       };
       // 添加一个随机数，防止缓存
       arr.push('v=' + random());
       return arr.join('&');
      }
      // 获取随机数
      function random() {
       return Math.floor(Math.random() * 10000 + 500);
      }
     },
    getUrlParam:(name)=>{
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  		var r = window.location.search.substr(1).match(reg);
  		if (r != null) return unescape(r[2]);
  		return null;
    },
    getUrlHashData:()=>{
      //获取#后面的参数对象
      var hashStr=location.hash.substr(1),lis=hashStr.split('&');
      var obj={};
      for(var i=0;i<lis.length;i++){
        var str=lis[i].split('=');
        if(str.length==2)obj[str[0]]=str[1];
      }
      return obj;
    },
    getUrlParamData:()=>{
      //获取url上的参数对象
      var hashStr=location.search.substr(1),lis=hashStr.split('&');
      var obj={};
      for(var i=0;i<lis.length;i++){
        var str=lis[i].split('=');
        if(str.length==2)obj[str[0]]=str[1];
      }
      return obj;
    },
    formatParams(data) {
      var arr = [];
      for (var name in data) {
        if(data[name]!==undefined)arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
      }
      return arr.join("&");
    },
    decryptDataToObject:(content)=>{
      // window.atob(window.btoa("dsadas"));
      return content ? JSON.parse(util.decode(content,"utf-8")  ) : null;
    },
    decryptData:(content)=>{
      return content ? util.decode(content,"utf-8") : null;
    },
    callback:(args,success,fail)=>{
      //统一回调封装
      var res=args;
      var _options={
        status:200, //默认200
        silence:true //静默处理异常 默认true
      };
      for (var attr in args) {
		       _options[attr] = args[attr];
	    }
      if(!res || typeof res !=='object'){
        console.warn('api 接口返回数据异常');
        return;
      }

      if(_options.status==res.data.status){
        var sst=res.data.content;
        try {
          //base64
          (function(data){
            setTimeout(()=>{
              success && success(data)
            },0)
          })(res.data.content ? JSON.parse(util.decode(res.data.content, "utf-8")):null)

        } catch (e) {
          // console.log('数据解码',e)
          try {
            (function(data){
              setTimeout(()=>{
                success && success(data)
              },0)
            })(res.data.content ? JSON.parse(res.data.content):null)

          } catch (e) {
            // console.log('数据解码',e)
            setTimeout(()=>{
              success && success(res.data.content)
            },0)
          }
        }

      }else{
        if(_options.silence){
          //统一处理异常
        }
        if(fail && typeof fail==='function'){
            //自定义处理异常
            fail(res.data)
        }else{
            //统一处理异常
            console.error(`${res.data.errorMessage}`)
        }
      }

    },
    authentication:(opt,sfn,ffn)=>{


      //鉴权函数
      function Auther(){
        var _options={
            needId:[1],//需要的权限
            success:'',
            fail:''
        };
        for(var attr in opt){
           _options[attr] = opt[attr];
        }
        this.option=_options;
        this.bool=this.checkRight(this.option.needId);


        if(this.bool){
          typeof this.option.success ==='function' && this.option.success()
          typeof sfn ==='function' && sfn()
        }else{
          //没有权限
          typeof this.option.fail ==='function' && this.option.fail()
          typeof ffn ==='function' && ffn(opt.needId)
        }

      }

      Auther.prototype.checkRight = (needId)=>{
        //鉴权逻辑
          var usrRights=util.getCookie('user_right').split(','),
              rights=util.getCookie('right_'+GLOBAL.shopId).split(','),
              totals=usrRights.concat(rights);
          var bool=false;
            if(typeof needId=='string' || typeof needId=='number'){
              bool=totals.some(function(ite){
                return ite==needId || ite==1;
              });
            }else if(Array.isArray(needId)){
                for(var i=0,t=needId.length; i<t; i++){
                      bool=totals.some(function(ite){
                        return ite==needId[i] || ite==1;
                      });
                      if(bool)break;
                }
            }
          return bool;
      }
        return new Auther();
    },
     elementInViewport:(element)=> {
      // 判断元素是否在可视范围内
        const rect = element.getBoundingClientRect();
        return (rect.top >= 0 && rect.left >= 0 && rect.top <= (window.innerHeight || document.documentElement.clientHeight));
    },
    storage:{
      timer:[],
      sessionStorage(){
        //使用 sessionStorage 会话存储
        return window.sessionStorage
      },
      get(key){
        key=key+GLOBAL.shopId;//
        return this.sessionStorage().getItem(key)
      },
    	set(key, data){
        key=key+GLOBAL.shopId;//
        return this.sessionStorage().setItem(key, typeof(data)==='string'?data:JSON.stringify(data))
      },
      setTimeData(key, data, n){
        if('object'!==typeof(data))return alert('缓存数据异常');
        key=key+GLOBAL.shopId;//
        console.log(`正在缓存-${key}`)
        this.sessionStorage().setItem(key, JSON.stringify(data))
        var tim=setTimeout(()=>{
            console.log(`正在删除-${key}`)
            this.sessionStorage().removeItem(key)
        },n ? (1000*n): 1000*60*10)
        var fts=this.timer.filter((ite)=>{
          return ite.uuidstorage==key;
        })[0];
        if(fts){
          //清除数据和定时器
          clearTimeout(fts.tim)
          this.timer =this.timer.filter((ite)=>{
            return ite.uuidstorage!==key;
          })
        }

        this.timer.push({
            uuidstorage:key,
            tim:tim
        })
      },
    	each(fn){
        for (var i = this.sessionStorage().length - 1; i >= 0; i--) {
      		var key = this.sessionStorage().key(i)
      		fn(read(key), key)
      	}
      },
    	remove(key){
        key=key+GLOBAL.shopId;//
        return this.sessionStorage().removeItem(key)
      },
    	clearAll(){
        return this.sessionStorage().clear()
      }
    }

};


;(function(){

/**
 * 此脚本仅提供原始的工具函数
 * @param name
 * @param fn
 * @returns {Function}
 */
//基本类：通过function扩展类型：提高语言的表现力（因为javascript原型继承的本质，所有的原型方法立刻被赋予到所有的实例）
Function.prototype.method=function(name,fn){
    if(!this.prototype[name]){
        this.prototype[name]=fn;
        return this;
    }
};
//去除字符串[左右]的空格 示例：" 12 a si 56 ".trim(); //12 as i56
if(!String.prototype.trim){
  String.method('trim',function(){
      return this.replace(/^\s+/,'').replace(/^\s+$/,'');
  });
}
//去除全部空格
if(!String.prototype.noSpace){
  String.method('noSpace',function(){
      return this.replace(/\s+/g, "");
  });
}
//高效JS数组乱序（为Array.prototype添加了一个函数） 调用arr.shuffle();
if (!Array.prototype.shuffle) {
  Array.prototype.shuffle = function() {
    for(var j, x, i = this.length; i; j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
    return this;
    };
}
// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
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


 })()

/************start base64依赖**********************/
   var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
     a256 = '',
     r64 = [256],
     r256 = [256],
     i = 0;

   var UTF8 = {

     /**
      * Encode multi-byte Unicode string into utf-8 multiple single-byte characters
      * (BMP / basic multilingual plane only)
      *
      * Chars in range U+0080 - U+07FF are encoded in 2 chars, U+0800 - U+FFFF in 3 chars
      *
      * @param {String} strUni Unicode string to be encoded as UTF-8
      * @returns {String} encoded string
      */
     encode: function(strUni) {
         // use regular expressions & String.replace callback function for better efficiency
         // than procedural approaches
         var strUtf = strUni.replace(/[\u0080-\u07ff]/g, // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
         function(c) {
             var cc = c.charCodeAt(0);
             return String.fromCharCode(0xc0 | cc >> 6, 0x80 | cc & 0x3f);
         })
         .replace(/[\u0800-\uffff]/g, // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
         function(c) {
             var cc = c.charCodeAt(0);
             return String.fromCharCode(0xe0 | cc >> 12, 0x80 | cc >> 6 & 0x3F, 0x80 | cc & 0x3f);
         });
         return strUtf;
     },

     /**
      * Decode utf-8 encoded string back into multi-byte Unicode characters
      *
      * @param {String} strUtf UTF-8 string to be decoded back to Unicode
      * @returns {String} decoded string
      */
     decode: function(strUtf) {
         // note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
         var strUni = strUtf.replace(/[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g, // 3-byte chars
         function(c) { // (note parentheses for precence)
             var cc = ((c.charCodeAt(0) & 0x0f) << 12) | ((c.charCodeAt(1) & 0x3f) << 6) | (c.charCodeAt(2) & 0x3f);
             return String.fromCharCode(cc);
         })
         .replace(/[\u00c0-\u00df][\u0080-\u00bf]/g, // 2-byte chars
         function(c) { // (note parentheses for precence)
             var cc = (c.charCodeAt(0) & 0x1f) << 6 | c.charCodeAt(1) & 0x3f;
             return String.fromCharCode(cc);
         });
         return strUni;
     }
   };

   while(i < 256) {
       var c = String.fromCharCode(i);
       a256 += c;
       r256[i] = i;
       r64[i] = b64.indexOf(c);
       ++i;
   }

   function code(s, discard, alpha, beta, w1, w2) {
       s = String(s);
       var buffer = 0,
           i = 0,
           length = s.length,
           result = '',
           bitsInBuffer = 0;

       while(i < length) {
           var c = s.charCodeAt(i);
           c = c < 256 ? alpha[c] : -1;

           buffer = (buffer << w1) + c;
           bitsInBuffer += w1;

           while(bitsInBuffer >= w2) {
               bitsInBuffer -= w2;
               var tmp = buffer >> bitsInBuffer;
               result += beta.charAt(tmp);
               buffer ^= tmp << bitsInBuffer;
           }
           ++i;
       }
       if(!discard && bitsInBuffer > 0) result += beta.charAt(buffer << (w2 - bitsInBuffer));
       return result;
   }
 /************end base64依赖**********************/



return util;
})

// define(function(require, exports, module){
// 'use strict';
// // require('cookiebase64');
//
//
// });
