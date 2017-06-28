function Select(options){
  this.settings = $.extend({
    ele : $('[component="select"]')[0]
  },options)
  this.$ele = $(this.settings.ele)
  this.width = this.$ele.attr('width')
  this.initElements()
  this.initEvents()
}

Select.prototype = {
  constructor : Select,
  initElements : function(){
    this.$select = $('<div class="select-component" />')
    this.$select_field = $('<div class="select-field" />')
    this.$select_option = $('<ul class="select-option" />')
    var _options = this.$ele.children('option')
    var _optionsArray = []
    for(var i = 0; i < _options.length;i++){
      var _v = $(_options[i]).attr('value')
      var _t = $(_options[i]).text()
      _optionsArray.push('<li data-value="'+_v+'">'+_t+'</li>')

      //设置选中的值
      if(this.$ele.val() == _v && i != 0){
        this.$select_field.text(_t).attr('value',this.$ele.val())
      }else if(!this.$ele.val() || this.$ele.val()==_v && i == 0){
        this.$select_field.text($(_options[0]).text()).attr('value',$(_options[0]).attr('value'))
      }

    }
    this.$select_option.html(_optionsArray.join(''))
    this.$select.append(this.$select_field).append(this.$select_option)
    this.$ele.before(this.$select)
    this.$ele.hide()
    if(this.width){
      this.$select_field.css({'width':this.width})
    }else{
      this.$select_field.css({"width":this.$select_option.width()})
    }
  },
  initEvents : function(){
    var _this = this
    //下拉
    this.$select_field.on('click',function(e){
      if(_this.$select_option.hasClass('on')){
        _this.off()
      }else{
        _this.no()
      }
    })
    //选择
    this.$select_option.children('li').on('click',function(e){
      var _name = _this.$ele.attr('name')
      var _v = $(this).data('value')
      var _t = $(this).text()
      $('[name="'+_name+'"]').val(_v)
        _this.$select_field.text(_t).attr('value',_v)
        _this.off()
        _this.$ele.change && _this.$ele.change()
    })
    $(document).on('click',function(e){
      var target = e.target || e.srcElement
      if(!$(target).hasClass('select-component') && !$(target).hasClass('select-field') && !$(target).hasClass('select-option')){
        _this.off()
      }
    })
  },
  no : function(){
    this.$select_option.addClass('on')
    this.$select.addClass('on')
  },
  off : function(){
    this.$select.removeClass('on')
    this.$select_option.removeClass('on')
  }
}

//初始化下拉框
$(function(){
  var select = $('[component="select"]')
  for(var i = 0; i < select.length; i++){
    new Select({
      ele : $(select[i])
    })
  }
})
