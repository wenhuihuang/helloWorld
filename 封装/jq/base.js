var base = {
    /**
     * uuid
     *  这个可以指定长度和基数(8,2)(8,10)(8,16)
     */
    uuid : function (len, radix) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [], i;
        radix = radix || chars.length;

        if (len) {
            // Compact form
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
        } else {
            // rfc4122, version 4 form
            var r;

            // rfc4122 requires these characters
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';

            // Fill in random data. At i==19 set the high bits of clock sequence as
            // per rfc4122, sec. 4.1.5
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random()*16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }

        return uuid.join('');
    }
};

/**
 * 对$.ajax封装一层 加入loading
 */
(function ($) {
    //1.得到$.ajax
    var _ajax = $.ajax;
    $.ajax = function (options) {
        //2。每次调用是的默认处理方法
        var fn = {
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("网络出错，请重试！" + XMLHttpRequest.responseText)
            },
            beforeSend: function (XHR) {
                //发送前
                var loading = $('<div class="loading-pop" style="position:fixed;top:0;bottom:0;left:0;right:0;z-index:10000; opacity:0.6; filter:alpha(opacity=60);background:rgb(228, 228, 228) " ><div style="position:fixed;top:0;bottom:0;left:0;right:0;z-index:11000;background:url(loading.gif) no-repeat center center"></div></div>');
                $('body').append(loading);

                //禁用提交按钮
                $('[type="submit"]').attr('disabled', true)
                $('[type="button"]').attr('disabled', true)
            },
            complete: function (XHR, TS) {
                //发送完成
                $('.loading-pop').remove()

                //启用提交按钮
                $('[type="submit"]').attr('disabled', false)
                $('[type="button"]').attr('disabled', false)
            }

        }
        //3.如果有写该方法时，调用外面写的方法
        if (options.error) {
            fn.error = options.error;
        }
        if (options.beforeSend) {
            fn.beforeSend = options.beforeSend
        }
        if (options.complete) {
            fn.complete = options.complete
        }

        var _options = $.extend(options, {
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                fn.error(XMLHttpRequest, textStatus, errorThrown);
            },
            beforeSend: function (XHR) {
                fn.beforeSend(XHR);
            },
            complete: function (XHR) {
                fn.complete(XHR);
            }
        })
        _ajax(_options)
    }
})(jQuery);

/**
 * 多个下拉选择关联
 * $('#comboboxLinkage').comboboxLinkage({
*            items:[{
*               url:'', //通过ajax请求数据
*               data:{}, //通过写数据 这个会优先
*               params:{}, // 通过ajax获取数据时 要传的参数
*               name:'', //select 的name
*               value:'', //默认选中的值
*               chooseText:true, //是否显示 -请选择-
*               onChange : function(value){} //change时的回调函数
*            },{
*               url:'',
*               data:{},
*               params:{},
*               name:'',
*               value:'',
*               chooseText:true
*            }]
*      });
 *
 */
(function ($) {
    $.fn.comboboxLinkage = function (options) {
        if (typeof options != 'object') {
            throw options + '不是对象参数！'
        }
        //将调用时候传过来的参数和default参数合并
        options = $.extend({}, $.fn.comboboxLinkage.default, options || {})
        function _init(target,items) {
            var self = this;
            var idArray = [];

            $.each(items,function (i,item) {

                var select = $('<select />')
                var data = item.data;
                var name = item.name;
                var value = item.value;
                var url = item.url;

                var id = base.uuid(8,16)
                idArray.push(id)
                select.attr('id',id)
                select.attr('name',name);

                if(item.chooseText){
                    select.append('<option value="">-请选择-</option>')
                }

               if(i != 0){
                   var  prevValue= items[i-1].value;
                   if(prevValue != null && prevValue != "" && prevValue != undefined){

                   }else{
                       if(value == null || value == "" || value == undefined){
                           select.hide();
                       }
                   }

               }



                //有data
                if(data != "" && data != null && data != undefined){
                    for(var k in data){
                        var option = $('<option />');
                        if(k == value){
                            option.attr('selected',true)
                        }
                        option.attr('value',k)
                        option.text(data[k])
                        select.append(option)
                    }
                }else{ //ajax请求
                        var prevItem = i ==0 ? item : items[i-1];
                        var  prevValue= item.value;
                        var itemData = $.extend({},item.params,{[name]:prevValue})

                        $.ajax({
                            type : 'GET',
                            url : url,
                            data : itemData,
                            success : function (data) {
                                console.log(data)
                                for(var k in data){
                                    var option = $('<option />');
                                    if(k == value){
                                        option.attr('selected',true)
                                    }
                                    option.attr('value',k)
                                    option.text(data[k])
                                    select.append(option)

                                }
                            },
                            error : function(msg){
                                throw "网络出错！" + msg
                            }
                        })

                }

                //绑定事件
                select.on('change',function(e){

                    var name = item.name;
                    var value = $(this).val();
                    var nextItem = items[i+1];

                    //绑定onChange
                    if(item.onChange){
                        item.onChange(value)
                    }

                    if(nextItem == null || nextItem == undefined) return;
                    var nextItemEle = $('#'+idArray[i+1]);
                    nextItemEle.val('')

                    if(nextItem.data != null && nextItem.data != "" && nextItem.data != undefined){ //如果有data
                        if(value != null && value != "" && value != undefined){
                            nextItemEle.show();
                        }
                    }else{ //如果通过ajax加载
                        if(value != null && value != "" && value != undefined){
                            nextItemEle.empty();

                            if(nextItem.chooseText){
                                nextItemEle.append('<option value="">-请选择-</option>')
                            }

                            var nextItemData = $.extend({},nextItem.params,{[name]:value})
                            console.log(nextItemData)

                            if(nextItem.data != null && nextItem.data != undefined && nextItem !=""){
                                return;
                            }
                            $.ajax({
                                type : 'GET',
                                url : nextItem.url,
                                data : nextItemData,
                                success : function (data) {
                                    var optionArray = []
                                    for(var k in data){
                                        optionArray.push('<option value='+k+'>'+data[k]+'</option>')


                                    }
                                    nextItemEle.append(optionArray.join(""))
                                    nextItemEle.show()
                                },
                                error : function(msg){
                                    throw "网络出错！" + msg
                                }
                            })
                        }

                    }

                    //隐藏后面的下拉选框
                    for(var j=0; j < idArray.length; j++){
                        var v = $('#'+idArray[j]).val();
                        if( v == null || v == "" || v == undefined ){
                            for(var a = j; a < idArray.length; a++){
                                $('#'+idArray[a+1]).hide();
                            }
                            break;
                        }

                    }


                })

                target.append(select)
            })

        }

        _init($(this),options.items)

    }

    //默认参数
    $.fn.comboboxLinkage.default = {}

    //方法
    $.fn.comboboxLinkage.method = {

    }


})(jQuery);
