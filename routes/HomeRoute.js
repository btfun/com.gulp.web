var express = require('express');
var router = express.Router();
var dateV=new Date();
var timeStamp= 'v='+dateV.getFullYear()+(dateV.getMonth()+1)
								+dateV.getDate()+dateV.getHours()+dateV.getMinutes();

/* 应用主页 */
router.get('/', function(req, res, next) {

  res.render('home_index', {
			version: timeStamp
		 });
});

/* 其他静态页面 */ 
router.get('/route', function(req, res, next) {

	var destination=req.query.route.replace('-','/'),
		view=req.query.view,
		routeModel='static/'+destination+'/'+view;

	res.render(routeModel, {

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
