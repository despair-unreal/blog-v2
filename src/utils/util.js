export default {
    loadImg: function (src) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.src = src;
        });
    },
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
    }
}
