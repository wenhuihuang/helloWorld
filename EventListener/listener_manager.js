/**
 * Created by hui on 2016-11-30.
 */
Namespace.register('hwh');
hwh.ListenerMgr = (function(){

    var _fn_showId = function (e) {
        console.log(this)
        alert($(this).attr('id'))
        return false;
    }
    var _fn_confirm = function (e) {

        alert($(this).html())
    }

    /*----------------------------------------------------*/
    /**
     * 在这里通过DOM节点的className来对应节点需要增加的事件监听
     * @type {{click: {}, mouseover: {}, mouseout: {}}}
     * @private
     */
    var _classNameListenerMap = {
        click : {
            'js_confirm' : _fn_confirm,
            'js_aa' : _fn_showId

        },
        mouseover : {

        },
        mouseout : {

        }
    }

    /**
     *启动事件监听管理器
     * @private
     */
    var _run = function () {
        window.addEventMap(
            $('.modal-page-main'),  //需要进行事件监听的容器
            ['click','mouseover','mouseout'],                     //event 列表
            _classNameListenerMap   //class映射表
        );
    }

    return {
        run : _run
    }
})()

$(function(){
    hwh.ListenerMgr.run();
})