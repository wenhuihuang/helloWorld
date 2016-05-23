(function() {
	function Winpop(options) {
		var self = this;
		this.Winpop = document.getElementsByClassName('Winpop');
		this.leftBtn = document.createElement('a');
		this.rightBtn = document.createElement('a');
		this.settings = this.extend({
			title: "标题",
			content: "内容",
			input: false,
			leftBtn:'取消',
			rightBtn:'确定',
			callback: null
		}, options, true);
		this.readerDOM();
		this.mask = document.getElementsByClassName('mask');
		this.addEvent();
	}
	Winpop.prototype = {
		constructor: Winpop,
		readerDOM: function() {
			var self = this;
			var title = this.settings.title;
			var content = this.settings.content;
			var input;
			if(this.settings.input == true){
				input = '<input type="text" id="WinpopInput">';
			}else{
				input=''
			}
			var leftBtn = this.settings.leftBtn;
			var rightBtn = this.settings.rightBtn;
			var html = 	'<div class="mask"></div>' 
							+ '<div class="pop-con">' 
								+ '<h5>'+title+'</h5>' 
								+ '<p>'+content+'</p>'
								+ input
								+ '<div class="btn-group">' 
								/*+ '<a href="javascript:;">'+leftBtn+'</a>' 
								+ '<a href="javascript:;" class="confirm">'+rightBtn+'</a>'*/ 
							+ '</div>' 
						+ '</div>';
			var ele = this.Winpop;
			for (var i = 0; i < ele.length; i++) {
				this.Winpop[i].innerHTML = html;
				var btnGroup = document.getElementsByClassName('btn-group')[0];
				self.leftBtn.innerHTML=self.settings.leftBtn;
				self.rightBtn.innerHTML=self.settings.rightBtn;
				btnGroup.appendChild(self.leftBtn)
				btnGroup.appendChild(self.rightBtn)
			}
		},
		extend: function(des, src, override) {
			var self = this;
			if (src instanceof Array) {
				for (var i = 0; i < src.length; i++) {
					this.extend(des, src[i], override);
				}
			}
			for (var i in src) {
				if (override || !(i in des)) {
					des[i] = src[i];
				}
			}
			return des;
		},
		addEvent:function(){
			var self = this;
			this.leftBtn.addEventListener('click',function(){
				self.hide.call(self)
			});
			this.rightBtn.addEventListener('click',function(){
				var v = document.getElementById("WinpopInput");
				if(v != null && v != ""){
					self.settings.callback.call(null,v.value);					
				}else{
					self.settings.callback.call(null,"");
				}
			});
			this.mask[0].addEventListener('click',function(){
				self.hide.call(self)
			});
		},
		hide:function(){
			var self = this;
			for(var i = 0 ; i< self.Winpop.length;i++){
				self.Winpop[i].style.display='none';
			}
			
		},
		show:function(){
			var self = this;
			var winpop = self.Winpop;
			for(var i = 0; i < winpop.length;i++){
				winpop[i].style.display='block';
			}
		}
	}
	window['Winpop'] = Winpop;
})()