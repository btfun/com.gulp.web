define(function(require){
'use strict'

 /* 模块主路由
  * 店铺应用主路由文件
  *
  *
  */

   const routes = [
     //主页部分
     { path:'', redirect:'index' },
     { path: '/index',         component: resolve => require(['home.indexModule'],resolve) }


   ]

   return routes;

});
