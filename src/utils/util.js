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
        for (let i in transitions) {
            if (el.style[i] !== undefined)
                return transitions[i];
        }
    },
    //判断字符串A是否以字符串B开头,不分大小写
    startWithCaseInsensitive: function (strA, strB) {
        strA = strA.toLowerCase();
        strB = strB.toLowerCase();
        const result = strA.startsWith(strB);
        return result;
    },
    //获取颜色值的格式
    getStrColorFormat: function (headStr) {
        headStr = headStr.substring(0, 4).toLowerCase();
        let headStrFormat = null;
        for (let i = headStr.length - 1; i >= 0; i--) {
            switch (headStr) {
                case "rgba":
                    headStrFormat = "rgba";
                    break;
                case "rgb":
                    headStrFormat = "rgb";
                    break;
                case "#":
                    headStrFormat = "html";
                    break;
                default:
                    headStr = headStr.substring(0, i);
                    break;
            }
        }
        return headStrFormat;
    },
    //将颜色值转换为指定的格式，headStrFormat参数可选
    changeColorFormat: function (finalFormat, headStr, headStrFormat) {
        let result;
        //获取颜色值格式
        if (!headStrFormat)
            headStrFormat = this.getStrColorFormat(headStr);
        switch (finalFormat) {
            case "html":
                if (headStrFormat === "rgb" || headStrFormat === "rgba") {
                    result = "#";
                    headStr.forEach((value, index) => {
                        if (index === 3) {
                            value = Math.round(value * 255);
                        }
                        result += value.toString(16).padStart(2, '0');
                    });
                } else
                    result = headStr;
                break;
            case "rgb":
            case "rgba": {
                let a = 1;
                let rgb = [];
                if (headStrFormat === "html") {
                    rgb[0] = parseInt(headStr.substring(1, 3), 16);
                    rgb[1] = parseInt(headStr.substring(3, 5), 16);
                    rgb[2] = parseInt(headStr.substring(5, 7), 16);
                    if (headStr.length > 7) {
                        a = parseInt(headStr.substring(6, 8), 16) / 255;
                    }
                } else {
                    rgb = headStr.splice(0, 3);
                    if (headStr.length > 0) a = headStr[0];
                }
                if (finalFormat === "rgba")
                    result = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`;
                else
                    result = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
                break;
            }
        }
        return result;
    },
    //随机生成指定格式的颜色值，默认html格式
    //可以指定颜色值的部分数值（headStr），html格式的只能指定开头数值
    randomColor: function (finalFormat, headStr = '#') {
        //设置最终格式默认值
        if (!finalFormat) finalFormat = "html";
        //给颜色值设置默认格式
        let headStrFormat = finalFormat;
        //获取颜色值的格式
        if (headStr) {
            headStrFormat = this.getStrColorFormat(headStr);
        }
        switch (headStrFormat) {
            case "html": {
                headStr = headStr.trim();
                while (headStr.length < 7) {
                    let random = Math.floor(Math.random() * 16).toString(16);
                    headStr += random;
                }
                break;
            }
            case "rgb":
            case "rgba": {
                //获取所有的颜色数字值
                let colorNumArr = headStr.match(/\(([^)]+)\)/)[1].split(",").splice(0, 4);
                //区分rgba和rgb，并根据长度少补多去
                let arrLength = colorNumArr.length;
                if (headStrFormat === "rgb") {
                    colorNumArr = colorNumArr.splice(0, 3);
                    arrLength = 3;
                } else
                    arrLength = 4;
                while (colorNumArr.length < arrLength) {
                    colorNumArr.push('');
                }
                //补充颜色数值
                const newColorArr = colorNumArr.map((value, index) => {
                    //去掉空格
                    value = value.trim();
                    if (value < 0) value = 0;
                    //rgba格式才有index3
                    if (index === 3) {
                        if (value > 1) value = 1;
                        //获取包含0和1的0-1的随机数
                        else if (value !== "0" && (!value || isNaN(Number(value)))) value = Math.floor(Math.random() * 11) / 10;
                    } else {
                        if (value > 255) value = 255;
                        //获取包含0和1的0-255的随机数
                        else if (value !== "0" && (!value || isNaN(Number(value)))) value = Math.floor(Math.random() * 256);
                    }
                    value = Number(value);
                    return value;
                });
                headStr = newColorArr;
                break;
            }
        }
        //获取转换指定格式后的颜色值
        const result = this.changeColorFormat(finalFormat, headStr, headStrFormat);
        return result;
    }
}
