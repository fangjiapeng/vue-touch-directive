import Vue from 'vue'
function sendData({event, data, callback}) {
    if (!event) {
      return
    }
    window.sensors.track(event, data, function () {
      callback && callback()
    })
}
  
// 埋点点击
const event = function (args) {
    return function () {
        sendData.apply(null, args)
    }
}
  
// 不同type的不同操作
const typeHandle = {
    show: function () {
        const args = arguments
        const el = Array.prototype.shift.call(args)
        el.exposureSingleTon = new window.Exposure({
        visivleRatio: 0.1
        })
        el.exposureSingleTon.add(el, (item) => {
        sendData.apply(null, Array.prototype.slice.call(args))
        })
    },
    click: function () {
        const args = arguments
        const el = Array.prototype.shift.call(args)
        el.addEventListener('click', event(Array.prototype.slice.call(args)), false)
    }
}
  
function bindFn(el, binding) {
    if (Object.prototype.toString.call(binding.value) === '[object Array]') {
        binding.value.forEach(item => {
        const {type = 'show', ...rest} = item
        typeHandle[type](el, rest)
        })
    } else {
        if (!binding.value.event) {
        return
        }
        const {type = 'show', ...rest} = binding.value
        typeHandle[type](el, rest)
    }
}
  
function unbindFn(el) {
    el.removeEventListener && el.removeEventListener('click', event)
    el.exposureSingleTon && el.exposureSingleTon.disconnect()
}
const sensors = {
    shence: {
        bind(el, binding, vNode) {
        /**
         * event: 请求事件
         * type：曝光事件，目前只支持 show, click
         * data: 请求体
         * callback: 回调函数
         */
        bindFn(el, binding, vNode)
        },
        update(el, binding, vNode) {
        if (binding.value && (JSON.stringify(binding.value) !== JSON.stringify(binding.oldValue))) {
            unbindFn(el)
            bindFn(el, binding, vNode)
        }
        },
        unbind(el) {
        // 去掉监听
        setTimeout(() => {
            unbindFn(el)
        })
        }
    }
}
  Vue.directive('shence', sensors.shence)