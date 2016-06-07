/**getUrlParam 获取url参数
 * setForm 自动设置form的值
 * getStyle 获取css样式
 * fullHeight 自动适应高度并且满屏
 */
;(function(){
	var HCore = function(){
		
	}
	
	HCore.prototype={
		constructor:HCore,
	}
	HCore={
		/**
		 * 获取url的参数如：www.baidu.com?aa=123 获取问号后的参数
		 * @param {Object} name 要获取的参数名
		 * @param {Object} url
		 */
		getUrlParam:function(name,url){
			var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i");
		    if (reg.test(url)) return decodeURIComponent(RegExp.$2.replace(/\+/g, " ")); return "";
		},
		/**
		 * 遍历后台传过来的json 自动为form对应的name设置对应值 格式 {"age":12,"name":"小黄","sex":"1","hobby":"乒乓球,足球","address":"1","note":"这个是备注"}
		 * @param {Object} id form的id
		 * @param {Object} data上面格式的json
		 */
		setForm:function(form,data){
					var formChild = $(form).find("*");
					for(var key in data){
						for(var i = 0; i< formChild.length;i++){
							//input
							if(formChild[i].tagName == "INPUT"){
								if($(formChild[i]).attr("name").toLowerCase() == key.toLowerCase()){
								
								//radio
								if($(formChild[i]).attr("type").toLowerCase() == "radio"){
								
									if($(formChild[i]).attr("value") == data[key]){
										$(formChild[i]).attr("checked","checked");
									}
								}
								
								//checkbox 
								if($(formChild[i]).attr("type").toLowerCase() == "checkbox"){
									//如果传过来的是数组
									if(data[key] instanceof Array){
											for(var j = 0;j < data[key].length;j++){
												if($(formChild[i]).attr("value") == data[key][j]){
													$(formChild[i]).attr("checked","checked");
												}
											}
										}
										//如果传来的是用,分割
										if(typeof data[key] == 'string'){
											var arr = data[key].split(",");
											for(var j = 0;j < arr.length;j++){
												if($(formChild[i]).attr("value") == arr[j]){
													$(formChild[i]).attr("checked","checked");
												}
											}
										}
										
									}
									
									
									//text
									if($(formChild[i]).attr("type").toLowerCase() == "text"){
										$(formChild[i]).val(data[key])
									}
								
									
								}
							}
							//select
							else if(formChild[i].tagName == "SELECT" &&　$(formChild[i]).attr("name").toLowerCase() == key.toLowerCase()){
								var op = $(formChild[i]).children("option");
								for(var o = 0 ; o < op.length ;o++){
									if($(op[o]).attr("value") == data[key]){
										$(op[o]).attr("selected","selected");
									}
								}
								
							}
							
							//textarea
							else if(formChild[i].tagName == "TEXTAREA"){
								if($(formChild[i]).attr("name").toLowerCase() == key.toLowerCase()){
									$(formChild[i]).html(data[key])
								}
							}
						}
					}
			},
			/**
			 * 获取css样式
			 * @param {Object} obj dom对象
			 * @param {Object} style 要获取的属性名
			 */
			getStyle:function(obj,style){
				if(obj.currentStyle){
					return obj.currentStyle[style];
				}else{
					return getComputedStyle(obj,false)[style];
				}
			},
			/**
			 * 设置容器内的模块自动适应高度 并且满屏
			 * @param {Object} parent 最外层容器dom对象
			 * @param {Object} child 容器内的模块dom对象 数组
			 */
			fullHeight:function(parent,child){
				var wrap = $(parent),
					childDiv;
				if(arguments.length > 1){
					childDiv = child;
				}else{
					childDiv = wrap.children();
				}
				//查找里面的table 将其设成block
				var block = [];
				for(var i = 0; i < child.length;i++){
					 block.push( $(child[i]).parentsUntil("parent"))
				}
				for(var i = 0 ;i < block.length;i++){
					for(var j = 0;j < block[i].length;j++){
						console.log(block[i][j])
						if(block[i][j].tagName == "TD" || block[i][j].tagName == "TR" || block[i][j].tagName == "TBODY" || block[i][j].tagName == "TH" || block[i][j].tagName == "TABLE" || block[i][j].tagName == "THREAD"){
							$(block[i][j]).css({"display":"block"});
						}
					}
				}
				
				var	bodyHeight = $(window).height(),
					wrapTop = wrap.offset().top,
					wrapHeight = bodyHeight-wrapTop;
				var hArr = [];//有定义高度的高
				var ele = [];//没定义高度的元素
				var fullHeight = 0;
				
				for(var i = 0; i < childDiv.length;i++){
					var h = this.getStyle(childDiv[i],'height');
					if(parseInt(h) != 0 && h != null && $(childDiv[i]).attr("data-height") != '0'){
						hArr.push(parseInt(h));
					}else{
						$(childDiv[i]).attr("data-height","0");
						ele.push(childDiv[i])
					}
				}
				for(var i =0;i < hArr.length;i++){
					fullHeight+=hArr[i];
				}
				//设置容器高度
				wrap.css({"height":wrapHeight})
				//为没有设置高度的子模块平分高度
				for(var i = 0 ;i < ele.length;i++){
					$(ele[i]).css({"height":(wrapHeight-fullHeight)/ele.length})
				};
				
			},
			/**
			 * 设置cookie
			 * @param {Object} name
			 * @param {Object} value
			 */
			setCookie:function(name,value){
			    var Days = 30; //设置过期的天数
			    var exp = new Date(); 
			    exp.setTime(exp.getTime() + Days*24*60*60*1000); 
			    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString(); 
			},
			/**
			 * 获取cookie
			 * @param {Object} name
			 */
			getCookie:function(name){
				 var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
			    if(arr=document.cookie.match(reg))
			        return unescape(arr[2]); 
			    else 
			        return null; 
			},
			/**
			 * 删除cookie
			 * @param {Object} name
			 */
			delCookie:function(name){
			    var exp = new Date(); 
			    exp.setTime(exp.getTime() - 1); 
			    var cval=this.getCookie(name); 
			    if(cval!=null) 
			        document.cookie= name + "="+cval+";expires="+exp.toGMTString(); 
			} 
	}
	
	window['HCore']=window.HCore=HCore;
})()
