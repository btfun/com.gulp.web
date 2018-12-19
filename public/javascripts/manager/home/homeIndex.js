
/*
 *  应用程序入口
 *  作者：battle
 */
define(function(require){
  'use strict'

  var Vue = require('vue');
  var VueRouter = require('vueRouter');
  var axios = require('axios');
  var qs = require('qs');
  // var Vuex = require('vuex');
  var eventBus= new Vue();//简单的全局事件通信
  Vue.prototype.eventBus = eventBus;
  Vue.prototype.$http = axios;

  var routerIndex = require('routerIndex');

  var ElementUI = require('ELEMENT');
  var globalUtil=require('globalUtil');


 // Vue.use(Vuex);
 Vue.use(ElementUI);
 Vue.use(VueRouter);

 /**********全局组件加载 start*****************/

/**********全局组件加载 end*****************/




 /**
  * 一: 应用全局状态树顶级模块入口
  *    应用全局状态集合
  **/
// const vuexStore= new Vuex.Store({
//      modules: {
//        // shopHome:   require('order.module')  //home 模块状态组件
//       //  custom: require('custom.module'),//custom 模块状态组件
//       //  busi:   require('busi.module')
//      }
//  });

 /**
  * 二: 应用全局路由顶级模块入口
  *
  **/
const routers = new VueRouter({
      mode:'hash',
      routes: routerIndex,
      scrollBehavior (to, from, savedPosition) {
        if (savedPosition) {
          return savedPosition
        } else {
          return { x: 0, y: 0 }
        }
      }
 });

 //路由拦截器
 routers.beforeEach((to, from, next) => {
   // console.log('当前路径：',to.path)
   if (to.matched.length === 0) { //如果未匹配到路由
      if(to.path.indexOf('#/!index')!==-1)return next('/');

      location.hash.indexOf('#/!')!==-1? next(location.hash.replace('#/!','')) : next('/')
    } else {
      next(); //如果匹配到正确跳转
    }

 });

 /**
  * 三: 应用全局的XHR请求配置
  *
  **/
var loadinginstace;
  //添加请求拦截器  参数内带有form 并且为真 表示为表单提交
  axios.interceptors.request.use((config)=>{
       //在发送请求之前做某事
       // eventBus.$emit('refreshLoding',true);//按钮加载...
       config.timeout=60000;

       if(!config.params)config.params={};
       // config.params.access_token=globalUtil.getCookie('access_token');//增加token参数 包括option请求也需要
       //
       // if(config.method !== 'put'){
       //   // if(!config.params)config.params={};
       //   // config.params.access_token=globalUtil.getCookie('access_token');//增加token参数
       //   if(config.method !== 'post')config.params=Object.assign(config.params,config.data||{})//避免后台不是从body里面取的数据
       //   if(!config.params.shop_sid)config.params.shop_sid=shopId;
       // }else{
       //   config.headers['Authorization'] = globalUtil.getCookie('access_token');
       //
       //   if(config.method == 'put'){
       //          if(config.data && config.data.form){
       //            config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
       //            config.data=qs.stringify(Object.assign(config.data,{
       //            access_token: globalUtil.getCookie('access_token'),
       //            }),{indices: false } )
       //          }
       //
       //   }
       // }
       //
       // //拦截器 大坑 config.headers.post['Content-Type']!=='application/json' &&
       // if(config.method == 'post' &&  config.data.form){
       //   //可去除options试探请求，表单请求
       //   config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
       //   config.data=qs.stringify(Object.assign(config.data,{
       //     access_token: globalUtil.getCookie('access_token'),
       //
       //   }),{indices: false } )
       //
       //   delete config.params;
       // }
       //
       // // delete config.data;
       // if(config.url){
       //  config.url=config.url.replace('{shopId}',shopId);//替换店铺号
       //  var tenant_id=(config.params && config.params.tenant_id) || globalUtil.storage.get('tenant_id');
       //  if(tenant_id)config.url=config.url.replace('{tenant_id}',tenant_id);//替换分销编码
       //  }else{
       //    ElementUI.Message({
       //      message: '警告，请求链接无效',
       //      type: 'error'
       //    });
       //  }

       return config;
     }, (error)=>{
       // loadinginstace.close()
       //请求错误时做些事
       // eventBus.$emit('refreshLoding',false);//按钮加载...
       var config=error.config||{};
       var response=error.response||{};
       if(config.url){
         ElementUI.Message({
           message: '警告，有请求错误',
           type: 'error'
         });
       }

       return Promise.reject(error);
     });
     //添加响应拦截器
     axios.interceptors.response.use((config)=>{
          // loadinginstace.close()
          //在响应之后做某事
          eventBus.$emit('refreshLoding',false);//按钮加载...
          return config;
        }, (error)=>{
          //请求错误时上报
          // loadinginstace.close()
          eventBus.$emit('refreshLoding',false);//按钮加载...

          var config=error.config||{};
          var response=error.response||{};
          if(config.url){
            ElementUI.Message({
              message: '警告，有请求错误',
              type: 'error'
            });
          }
          // report({
          //   resourceUrl: config.url,
          //   method:  config.method,
          //   category: 'XHR ERROR',
          //   msg: `${response.status}-${response.statusText}`
          // })
          return Promise.reject(error);
        });


  // Vue.config.devtools = true
  // Vue.config.errorHandler = function (err, vm) {
  //   // 错误拦截器
  // }


 /**
  *  end:挂载实例
  *
  **/

 const app = new Vue({
   router: routers, 
 }).$mount('#app');



});
