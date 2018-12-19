var  gulp = require('gulp'),
     babel = require('gulp-babel'),//es6转es5
     uglify = require('gulp-uglify'),//js压缩仅支持es5写法
     minifycss = require('gulp-minify-css'),//css压缩
     less = require('gulp-less'),//编译less
     gulpif = require('gulp-if'),
     minimist = require('minimist'),
     minifyhtml = require('gulp-htmlmin'),//压缩html
     concat = require('gulp-concat'),//合并文件 css使用
     autoprefixer = require('gulp-autoprefixer'),//CSS浏览器前缀补全
     // imagemin = require('gulp-imagemin'),//图片压缩
     // imageminPngquant = require('imagemin-pngquant'),
     // imageminJpegtran = require('imagemin-jpegtran'),
     cache = require('gulp-cache'),
     changed = require('gulp-changed'),//只通过改变的文件
     rename = require('gulp-rename'),//重命名
     watch = require('gulp-watch'),//监听
     rev = require('gulp-rev'),//hash
     merge = require('merge-stream'),
     runSequence= require('run-sequence'),// 顺序执行
     revCollector= require('gulp-rev-collector'),//路径替换
     through2= require('through2'),//路径替换
     del = require('del'),//删除
     clean = require('gulp-clean'),//删除
     notify = require('gulp-notify'),
     debug = require('gulp-debug'),
     plumber = require('gulp-plumber'),
     sourcemaps = require('gulp-sourcemaps'),
     jshint=require('gulp-jshint'),//语法检查
     path = require('path'),
     fs = require('fs'),
     glob = require('glob');

var browserSync = require('browser-sync').create();
var nodemon = require('gulp-nodemon');
var reload  = browserSync.reload;
// var Server  = require('karma').Server;



var paths = {
       path:'public/',
       styles: {
         //店铺内模块样式
         src:    ['public/components/**/*.{css,less}','!public/components/manager/home/**/*.{css,less}','!public/components/manager/menu/**/*.{css,less}'],//组件样式，需合并  '!public/components/**/theme-*.{css,less}'
         toBulid:'public/stylesheets/manager/shop.{css,less}',

         dest:   'dist/stylesheets/manager',
        //登录前模块样式
         srcApp:    ['public/components/manager/home/**/*.{css,less}'],
         toBulidApp: 'public/stylesheets/manager/app.{css,less}',

         libSrc: 'public/stylesheets/lib/**/*.*',//可能存在字体文件 所以用*号
         libTo:  'dist/stylesheets/lib'
       },
       tmpls: {
         src: 'public/components/**/*.html',//模板，无需合并
         dest: 'dist/components'
       },
       scripts: {
         requireConf : './public/javascripts/manager/**/requireConf.js',
         //组件
         componentsSrc: 'public/components/**/*.js',
         componentsTo: 'dist/components',
         //公用
         golablBaseSrc: 'public/javascripts/base/**/*.js',
         golablBaseTo: 'dist/javascripts/base',
         //主入口
         golablSrc: 'public/javascripts/manager/**/*.js',
         golablTo: 'dist/javascripts/manager',
         //lib脚本
         libSrc: 'public/javascripts/lib/**/*.*',
         libTo: 'dist/javascripts/lib'
       },
       images:{
         src: 'public/components/**/*.{png,jpg,gif,ico}',
         dest: 'dist/images'
       }
     };


  var knownOptions = {
    string: 'env',
    default: { env: process.env.NODE_ENV || 'dev' }
  };


  var options ={
    env :  process.env.NODE_ENV || 'dev'
  }
  var str=process.argv.slice(2);
  if(str.length===3){
    options.env=str[2] || 'dev'
  }
  if(str){
    options.env=str[0]
  }



//css 编译压缩
// gulp.task('mini_shop_css', function(){
//   //注意 如果发现合并后的css文件大小超过500KB 则需要处理成2个压缩文件
//
//     return gulp.src(paths.styles.toBulid)
//     // .pipe( changed(paths.styles.dest,{extension: '.min.css'}))//通过改变的文件
//     .pipe( debug({title: '编译css:'}))
//     .pipe( plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
//     .pipe( gulpif(options.env !== 'online', sourcemaps.init() ))//发布的时候才取消 sourcemaps
//     .pipe( less())
//     .pipe( gulpif(options.env !== 'online', sourcemaps.write() ))
//     .pipe(autoprefixer({
//         browsers: ['last 2 versions', 'Android >= 4.0'],
//         cascade: true, //是否美化属性值 默认：true 像这样：
//         remove:true //是否去掉不必要的前缀 默认：true
//     }))
//     .pipe( gulpif(options.env === 'online',minifycss({
//       advanced: true,
//       keepSpecialComments: '*'
//     })) )//发布的时候才压缩
//     .pipe( concat('shop.min.css'))
//     // .pipe( gulpif(options.env === 'online',rename({suffix: '.min'})) )//发布的时候才 rename压缩后的文件名
//     .pipe( gulp.dest(paths.styles.dest) ) //输出文件夹
//     .pipe(reload({stream: true})); //编译后注入到浏览器里实现更新
//
// });

gulp.task('mini_app_css', function(){
  //注意 如果发现合并后的css文件大小超过500KB 则需要处理成2个压缩文件

    return gulp.src(paths.styles.toBulidApp)
    // .pipe( changed(paths.styles.dest,{extension: '.min.css'}))//通过改变的文件
    .pipe( debug({title: '编译css:'}))
    .pipe( plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    .pipe( gulpif(options.env !== 'online', sourcemaps.init() ))//发布的时候才取消 sourcemaps
    .pipe( less())
    .pipe( gulpif(options.env !== 'online', sourcemaps.write() ))
    .pipe(autoprefixer({
        browsers: ['last 2 versions', 'Android >= 4.0'],
        cascade: true, //是否美化属性值 默认：true 像这样：
        remove:true //是否去掉不必要的前缀 默认：true
    }))
    .pipe( gulpif(options.env === 'online',minifycss({
      advanced: true,
      keepSpecialComments: '*'
    })) )//发布的时候才压缩
    .pipe( concat('app.min.css'))
    // .pipe( gulpif(options.env === 'online',rename({suffix: '.min'})) )//发布的时候才 rename压缩后的文件名
    .pipe( gulp.dest(paths.styles.dest) ) //输出文件夹
    .pipe(reload({stream: true})); //编译后注入到浏览器里实现更新

});

// gulp.task('mini_root_css', function(){
//   //注意 如果发现合并后的css文件大小超过500KB 则需要处理成2个压缩文件
//
//     return gulp.src(paths.styles.toBulidRoot)
//     // .pipe( changed(paths.styles.dest,{extension: '.min.css'}))//通过改变的文件
//     .pipe( debug({title: '编译css:'}))
//     .pipe( plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
//     .pipe( gulpif(options.env !== 'online', sourcemaps.init() ))//发布的时候才取消 sourcemaps
//     .pipe( less())
//     .pipe( gulpif(options.env !== 'online', sourcemaps.write() ))
//     .pipe(autoprefixer({
//         browsers: ['last 2 versions', 'Android >= 4.0'],
//         cascade: true, //是否美化属性值 默认：true 像这样：
//         remove:true //是否去掉不必要的前缀 默认：true
//     }))
//     .pipe( gulpif(options.env === 'online',minifycss({
//       advanced: true,
//       keepSpecialComments: '*'
//     })) )//发布的时候才压缩
//     .pipe( concat('root.min.css'))
//     // .pipe( gulpif(options.env === 'online',rename({suffix: '.min'})) )//发布的时候才 rename压缩后的文件名
//     .pipe( gulp.dest(paths.styles.dest) ) //输出文件夹
//     .pipe(reload({stream: true})); //编译后注入到浏览器里实现更新
//
// });



//lib库复制
gulp.task('copylib',function(){
  var jslib= gulp.src(paths.scripts.libSrc)
        .pipe( gulp.dest(paths.scripts.libTo));

  var csslib= gulp.src(paths.styles.libSrc)
        .pipe( gulp.dest(paths.styles.libTo));

  return merge(jslib, csslib);
});

/***********************js模块编译压缩*******************************/
gulp.task('minifyjs', function(){

  var base= gulp.src(paths.scripts.golablBaseSrc)
      .pipe( plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
      .pipe( changed(paths.scripts.golablBaseTo))//通过改变的文件
      .pipe( babel({presets: ['es2015','stage-3']})) //es6转es5
      .pipe( jshint())//语法检查
      // .pipe( jshint.reporter('default'))//默认错误提示(最严格)
      .pipe( gulpif(options.env === 'online', uglify({
           mangle: {except: ['require' ,'exports' ,'module' ,'$','that']}
          }).on('error',function(e){
           console.error('【minifyjs】错误信息:',e);
         }) ))//发布的时候才压缩
      .pipe( gulpif(options.env === 'online',rev()) )//发布的时候才MD5
      .pipe( gulp.dest(paths.scripts.golablBaseTo))  //输出
      .pipe(reload({stream: true})) //编译后注入到浏览器里实现更新
      .pipe( gulpif(options.env === 'online',rev.manifest({merge:true})) )//输出描述文件rev-manifest.json
      .pipe( gulpif(options.env === 'online',gulp.dest('')) );
      // Math.random().toString(36).substr(2, 20)

  var manager=gulp.src(paths.scripts.golablSrc)
      .pipe( plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
      .pipe( changed(paths.scripts.golablTo))//通过改变的文件
      .pipe( babel({presets: ['es2015','stage-3']})) //es6转es5
      .pipe( jshint())//语法检查
      .pipe( gulpif(options.env === 'online', uglify({
          mangle: {except: ['require' ,'exports' ,'module' ,'$','that']}
          }).on('error',function(e){
          console.error('【minifyjs】错误信息:',e);
        }) ))//发布的时候才压缩
      .pipe( gulpif(options.env === 'online',through2.obj(function(file, encoding, done){
          var content =  (String(file.contents));
          content=content.replace(`$$$`, `${Math.random().toString(36).substr(2, 20)}`);
          file.contents = new Buffer(content);
          this.push(file);
          done();
        })
       ) )//替换'$$$'表示每次编译一定会有不同的hash
      .pipe( gulpif(options.env === 'online',rev()) )//发布的时候才hash
      .pipe( gulp.dest(paths.scripts.golablTo))  //输出
      .pipe(reload({stream: true})) //编译后注入到浏览器里实现更新
      .pipe( gulpif(options.env === 'online',rev.manifest({merge:true})) )//输出描述文件rev-manifest.json
      .pipe( gulpif(options.env === 'online',gulp.dest('')) );


    var requireConf={};
    //获取所有的配置文件
    glob.sync(paths.scripts.requireConf).forEach(function (entry) {
        var dir = require(entry);
        Object.assign(requireConf,dir)
    });
    //筛选出模板
    var maps=Object.keys(requireConf).filter((ite)=>{ return  ite.indexOf('Tmpl')>-1 ?true:false; });

var components=gulp.src(paths.scripts.componentsSrc)
    .pipe( plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    .pipe( changed(paths.scripts.componentsTo))//通过改变的文件
    .pipe( debug({title: '编译js:'}))
    .pipe( babel({presets: ['es2015','stage-3']})) //es6转es5
    .pipe( jshint())//语法检查
    .pipe( gulpif(options.env === 'online', uglify({
         mangle: {except: ['require' ,'exports' ,'module' ,'$','that']}
        }).on('error',function(e){
         console.error('【minifyjs】错误信息:',e);
       }) ))//发布的时候才压缩
       .pipe( gulpif(options.env === 'online',
            through2.obj(function(file, encoding, done) {
              var content =  (String(file.contents));
              var item=maps.filter((item)=>{
                      return   content.indexOf(`require('text!${item}.html')`) >-1  || content.indexOf(`require("text!${item}.html")`) >-1;
              })[0];
              if(item){
                  var pathll='./dist/'+requireConf[item]+'.html';
                  if(pathll){
                      var str = fs.readFileSync(path.resolve(__dirname, pathll),'utf8');
                      str=new Buffer(encodeURIComponent(str)).toString();
                      content=content.replace(`require('text!${item}.html')`, `decodeURIComponent("${str}")`);
                      content=content.replace(`require("text!${item}.html")`, `decodeURIComponent("${str}")`);
                  }
              }
              file.contents = new Buffer(content);
              this.push(file);
              done();
          })
      ))//发布的时候才替换减少开发时编译时间
    .pipe( gulpif(options.env === 'online',rev()) ) //发布的时候才hash
    .pipe( gulp.dest(paths.scripts.componentsTo))  //输出
    .pipe(reload({stream: true})) //编译后注入到浏览器里实现更新
    .pipe( gulpif(options.env === 'online',rev.manifest({merge:true})) )//输出描述文件rev-manifest.json
    .pipe( gulpif(options.env === 'online',gulp.dest('')) );

      return merge(base, manager,components);
});

//html模板压缩
gulp.task('minifyhtml', function(cb) {
   return gulp.src(paths.tmpls.src)
    .pipe( minifyhtml({removeComments: true,collapseWhitespace: true}))
    //.pipe( gulpif(options.env === 'online',rev()) ) //发布的时候才MD5
    .pipe(gulp.dest(paths.tmpls.dest))
    .pipe(reload({stream: true})) //编译后注入到浏览器里实现更新
    //.pipe( gulpif(options.env === 'online',rev.manifest({merge:true})) )//输出描述文件rev-manifest.json
    //.pipe( gulpif(options.env === 'online',gulp.dest('')) );
});

//图片压缩
gulp.task('minifyimages', function() {
  return gulp.src(paths.images.src)
    // .pipe(cache(imagemin({
    //         optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
    //         progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
    //         svgoPlugins: [{removeViewBox: false}],//不要移除svg的viewbox属性
    //         use: [imageminPngquant(),imageminJpegtran()] //使用pngquant深度压缩png图片的imagemin插件
    //     })))
    .pipe(gulp.dest(paths.images.dest));

});

gulp.task("replace_viewHtmlPath",function (cb) {
  //更新html页面上的文件
    gulp.src(['./templates/**/*.html'])
        .pipe(gulp.dest('./views/'))
        .on('end', cb);
});

// 静态服务器 + 监听 scss/html 文件

gulp.task('server',function(cb){
    var started = false;
      nodemon({
        ignore:['gulpfile.js','./node_modules/','./public/','./dist/'], //忽略不需要监视重启的文件 ,
        script: './bin/www'
    }).on('start',function(){
      if (!started) {
        started = true;
        browserSync.init({
            files: ['./views/**/*.*'], //, './public/**/*.*'（和浏览器注入脚本不能同事使用）
            proxy:'http://127.0.0.1:9010', //设置代理运行本地的3000端口
            port:9090, //设置browser-sync的运行端口号
            browser: 'chrome',
            notify: false
        },function(){
            console.log('浏览器已刷新')
        })
      }
    });
    gulp.run('watch');
})

//删除掉上一次构建时创建的资源
gulp.task('clean', function() {
  return del(['dist/*','rev-manifest.json','!dist/favicon.ico']);
});

/////////////////////////////////////开发 =>gulp////////////////////////////////////////////////////
//'server',
gulp.task('default', ['copylib','minifyjs','mini_app_css', 'minifyhtml','minifyimages','replace_viewHtmlPath'], function(callback) {

  // 将你的默认的任务代码放在这

});

gulp.task('watch', function() {
  gulp.watch([paths.styles.srcApp, paths.styles.toBulidApp],  ['mini_app_css']);
  // gulp.watch([paths.styles.srcRoot, paths.styles.toBulidRoot],  ['mini_root_css']);

  // gulp.watch([paths.scripts.golablSrc], ['minifyjsConf']);
  gulp.watch([paths.scripts.golablSrc,paths.scripts.golablBaseSrc, paths.scripts.componentsSrc], ['minifyjs']);
  gulp.watch([paths.tmpls.src], ['minifyhtml']);
  gulp.watch(['./templates/**/*'], ['replace_viewHtmlPath']);
});

/////////////////////////////////////生产=> gulp online////////////////////////////////////////////////////

//构建总入口
gulp.task('online', function(callback) {
options.env='online'; //开启压缩
   runSequence(
      ['copylib','minifyhtml','mini_app_css', 'mini_root_css', 'minifyimages'],
       'minifyjs',  //等待 minifyhtml 并替换到JS里面后再编译
       "online_replaceSuffix",               //- 替换.js .html后缀
       "online_replace_requireConfPath",      //- 路径替换为hash后的路径
       // "online_replace_childConfPath",
       // "online_replace_layerConfPath",
       // "online_replace_homeConfPath",
       // "online_replace_menuConfPath",
       "online_replace_viewHtmlPath",
       callback);
});

function modify(modifier) {
    return through2.obj(function(file, encoding, done) {
        var content = modifier(String(file.contents));
        file.contents = new Buffer(content);
        this.push(file);
        done();
    });
}

function replaceSuffix(data) {
    return data.replace(/\.js/gmi, "").replace(/\.html/gmi, "").replace(/\.css/gmi, "");
}

gulp.task("online_replaceSuffix",function (cb) {
    gulp.src(['rev-manifest.json'])
        .pipe(modify(replaceSuffix))            //- 去掉.js后缀
        .pipe(gulp.dest(''))
        .on('end', cb);
});
//根据业务配置多个替换规则 start ******

gulp.task("online_replace_homeConfPath",function (cb) {
    gulp.src(['rev-manifest.json','./dist/javascripts/manager/home/requireConf-*.js'])
        .pipe(revCollector())   //- 替换为MD5后的文件名
        .pipe(rename('requireConf.js')) //每次发布必更新的文件直接使用系统时间
        .pipe(gulp.dest('./dist/javascripts/manager/home'))
        .on('end', cb);
});
gulp.task("online_replace_menuConfPath",function (cb) {
    gulp.src(['rev-manifest.json','./dist/javascripts/manager/menu/requireConf-*.js'])
        .pipe(revCollector())   //- 替换为MD5后的文件名
        .pipe(rename('requireConf.js')) //每次发布必更新的文件直接使用系统时间
        .pipe(gulp.dest('./dist/javascripts/manager/menu'))
        .on('end', cb);
});

gulp.task("online_replace_requireConfPath",function (cb) {
    gulp.src(['rev-manifest.json','./dist/javascripts/manager/shop/requireConf-*.js'])
        .pipe(revCollector())   //- 替换为MD5后的文件名
        .pipe(gulp.dest('./dist/javascripts/manager/shop'))
        .on('end', cb);
});

gulp.task("online_replace_viewHtmlPath",function (cb) {
  //更新html页面上的文件
    gulp.src(['rev-manifest.json','./templates/**/*.html'])
        .pipe(revCollector() )   //- 替换为MD5后的文件名
        .pipe(gulp.dest('./views/'))
        .on('end', cb);
});


gulp.task("online_replace_childConfPath",function (cb) {
    gulp.src(['rev-manifest.json','./dist/javascripts/manager/shop/child/childConf-*.js'])
        .pipe(revCollector())   //- 替换为MD5后的文件名
        .pipe(rename('childConf.js')) //每次发布必更新的文件直接使用系统时间
        .pipe(gulp.dest('./dist/javascripts/manager/shop/child'))
        .on('end', cb);
});
gulp.task("online_replace_layerConfPath",function (cb) {
    gulp.src(['rev-manifest.json','./dist/javascripts/manager/shop/layer/layerConf-*.js'])
        .pipe(revCollector())   //- 替换为MD5后的文件名
        .pipe(rename('layerConf.js')) //每次发布必更新的文件直接使用系统时间
        .pipe(gulp.dest('./dist/javascripts/manager/shop/layer'))
        .on('end', cb);
});
//根据业务配置多个替换规则 end ******


////////////////////////////////测试////////////////////////////////////////////////////

gulp.task('test', function (done) {
  // new Server({
  //   configFile: __dirname + '/karma.conf.js',
  //   singleRun: true
  // }, done).start();
});
