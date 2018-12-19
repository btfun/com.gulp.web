(function(confRoot,wxRoot){
	"use strict";
	/**
	 * 外部登录相关（用户登录前）
	 *
	 */
	if(!confRoot){
		 confRoot="http://saas.mljia.cn";
	}
	var requestUrl={
		 

	};

	window.requestUrl=requestUrl;

	/**
	 * 通用的解密函数
	 * 防止将来要变
	 * 传入字符串 返回json对象
	 */
	function decryptData(content){
		return content ? JSON.parse($.base64.decode(content,"utf-8")) : null;
	}
	window.decryptData=decryptData;
})(GLOBAL.confRoot,GLOBAL.wxRoot);
