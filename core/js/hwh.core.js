/*绑定事件*/
function hwhAddEvent(obj,eve,fn){
	if(obj.attachEvent){
		obj.attachEvent("on"+eve,function(){
			fn.call(obj);
		});
	}
	else{
		obj.addEventListener(eve,fn,false);
	}
}
/*通过class获取元素*/
function getByClass(oParent,sClass){
	var all=oParent.getElementsByTagName("*");
	var result=[];
	for(var i=0;i<all.length;i++){
		if(all[i].getAttribute("class") == sClass){
			result.push(all[i]);
		}
	}
	return result;
}
/*获取元素样式*/
function getStyle(obj,attr){
	if(obj.currentStyle){//currentStyle ie
		return obj.currentStyle[attr];
	}else{
		return getComputedStyle(obj,false)[attr]; 
	}
}
/*将标签或另一个数组元素加入到数组*/
function addArray(array1,array2){
	for(var i=0;i<array2.length;i++){
		array1.push(array2[i]);
	}
}
/*获取index*/
function getIndex(obj){
	var siblings=obj.parentNode.children;
	for(var i=0;i<siblings.length;i++){
		if(siblings[i] == obj){
			return i;
		}
	}
}
/*我的库*/
function hwhCore(vArgs){
	this.ele=[];
	switch (typeof vArgs){
		case "function":
			hwhAddEvent(window,'load',vArgs)//通过绑定添加window.onload
			break;
		case "string":
			switch (vArgs.charAt(0)){
				case "#":
					var a=document.getElementById(vArgs.replace(/^#*/g,""));
					
					this.ele.push(a)
					break;
				case ".":
					this.ele=getByClass(document,vArgs.replace(/^\.*/g,""));
					break;
				default:
					this.ele=document.getElementsByTagName(vArgs);
					break;
			}
			break;
		case "object":
			this.ele.push(vArgs);
			break;
		default:
			break;
	}
}
//通过$获取
function $(vArgs){
	return new hwhCore(vArgs);
}
hwhCore.prototype.click=function(fn){
	for(var i=0;i<this.ele.length;i++){
		hwhAddEvent(this.ele[i],"click",fn);
	}
}
//hide方法
hwhCore.prototype.hide=function(){
	for(var i = 0; i<this.ele.length;i++){
		this.ele[i].style.display="none";
	}
}
//show方法
hwhCore.prototype.show=function(){
	for(var i=0;i<this.ele.length;i++){
		this.ele[i].style.display="block";
	}
}
//toggle
hwhCore.prototype.toggle=function(){
	var _arguments=arguments;
	for(var i=0;i<this.ele.length;i++){
		addToggle(this.ele[i])
		
	}
	function addToggle(obj){
		var count=0;
		hwhAddEvent(obj,"click",function(){
			_arguments[count++%_arguments.length].call(obj);
		});
		
	}
}
//hover方法
hwhCore.prototype.hover=function(fn1,fn2){
	for(var i =0;i<this.ele.length;i++){
		hwhAddEvent(this.ele[i],"mouseover",fn1);
		hwhAddEvent(this.ele[i],"mouseout",fn2);
	}
}
//css方法
hwhCore.prototype.css=function(name,value){
	if(arguments.length == 2){
		for(var i=0;i<this.ele.length;i++){
			this.ele[i].style[name]=value;
		}
	}else if(arguments.length == 1){
		return getStyle(this.ele[0],name)
	}
	return this;//链式操作--返回当前对象
}
//attr方法
hwhCore.prototype.attr=function(key,value){
	if(arguments.length == 2){
		for(var i =0;i<this.ele.length;i++){
			this.ele[i].setAttribute(key,value);
			this.ele[i][key]=value;
		}
	}else{
		for(var i =0;i<this.ele.length;i++){
			return this.ele[0][key]
		}
	}
};
//eq方法
hwhCore.prototype.eq=function (n)
{
	return $(this.ele[n]);
	
};
//find方法
hwhCore.prototype.find=function(str){
	var result=[];
	for(var i=0;i<this.ele.length;i++){
		switch (str.charAt(0)){
			case ".":
				var aEle=getByClass(this.ele[i],str.replace(/^\.*/g,""));
				result=result.concat(aEle);
				break;
			default:
				var aEle=this.ele[i].getElementsByTagName(str)
				addArray(result,aEle);
				break;
		}
	}
	var newHwhcore=$();
	newHwhcore.ele=result;
	return newHwhcore;
}
//index方法
hwhCore.prototype.index=function(){
	return getIndex(this.ele[0])
}
//extend方法
hwhCore.prototype.extend=function(ev,fn){
	hwhCore.prototype[ev]=fn;
}
