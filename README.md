### saas.web

*作者：battle*
*创建时间：2018.11.6*

### （重构）开发流程
1. 组织模块结构目录->配置：路径，路由
2. 基础样式编码
3. 基础功能开发->查询，增删改
4. 兼容样式编码

### 样式书写规范
1. 全局唯一模块名->shop-xxx
2. 背景容器->container
3. 内容主体容器->xxx-index
4. 条件容器->condition
5. 内容容器->content
6. CSS嵌套不要超过4层

> css书写样例

<pre>
.shop-home{
  .container{
      width:100%; //屏幕宽度
  }
  .home-index{
    width:@1340px;//内容宽度 小屏1220px

    .layout-top   //常用布局
    .layout-middle//常用布局
    .layout-bottom//常用布局
    .layout-fl    //常用布局
    .layout-fr    //常用布局
    .condition    //常用布局 条件筛选
    .content      //常用布局 内容列表

  }
}
</pre>

> 项目文件

* bin ---启动文件
* conf ---配置文件
* dist ---编译*后css,js文件
* public ---源css,js文件
* routes ---路由
* templates ---源html文件
* views ---编译*后html文件

> 【待改进】

线上打包 分析API文件，全局替换对应的API，避免API文件直接暴露


> 【模块待改进】

* 增加用户引导模块的独立开发
* 增加消息机制模块的独立开发




## Build Setup
``` bash
# 安装所需文件
npm install

# 1  编译文件
gulp

# 2 auto open chrome
gulp server  (gulp clean && gulp && gulp server)

# 1 先清除文件
gulp clean

# 2 生产环境文件编译
gulp --env online

# 3 生产环境文件MD5替换
gulp online  (gulp clean && gulp online)


# pm2管理工具
pm2 delete www  
