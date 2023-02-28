export default {
    //加载图片
    loadImg: function (src) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.src = src;
        });
    },
    //深拷贝
    objDeepClone: function (obj) {
        if (obj === null) return null
        if (typeof obj !== 'object') return obj;
        if (obj.constructor === Date) return new Date(obj);
        //判断是否为dom元素
        if (typeof HTMLElement === 'object') {
            if (obj instanceof HTMLElement)
                return obj.cloneNode(true);
        } else {
            if (obj.nodeType === 1 && typeof obj.nodeName === 'string')
                return obj.cloneNode(true);
        }
        let newObj = new obj.constructor(); //保持继承链
        for (let key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) { //不遍历其原型链上的属性
                let val = obj[key];
                let newVal = this.objDeepClone(val);
                newObj[key] = typeof val === 'object' ? newVal : val;
            }
        }
        return newObj;
    },
    //判断鼠标滚轮方向
    mouseWheelDirection: function (event) {
        let direction = event.wheelDelta > 0 ? "Up" : "Down";
        return direction;
    },
    whichTransitionEvent: function () {
        const el = document.createElement("fakeElement");
        //存储对应的事件名
        const transitions = {
            'transition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'MozTransition': 'transitionend',
            'WebkitTransition': 'webkitTransitionEnd',
            'MsTransition': 'msTransitionEnd'
        }
        //检测支持何种形式的transitionend事件
        for(let i in transitions){
            if(el.style[i] !== undefined)
                return transitions[i];
        }
    }
}
