export default {
    //加载图片
    loadImg: function (src,crossOrigin) {
        return new Promise((resolve) => {
            const img = new Image();
            crossOrigin && (img.crossOrigin = crossOrigin); //需要图片跨域支持
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
    //判断支持何种形式的transitionend事件
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
    // 把毫秒转换为需要的时间格式
    millisecondConversionTime(millisecond, unitsArray) {
        const dateTime = new Date(millisecond);
        const sortUnits = ['year', 'month', 'day', 'hours', 'minutes', 'seconds'];
        if (!unitsArray) unitsArray = sortUnits;
        // 把拿到的需要的单位按照sortUnits的顺序来排序
        unitsArray.sort((a, b) => {
            return sortUnits.indexOf(a) - sortUnits.indexOf(b);
        });
        // 把日期和时间分开存储
        let date, time = [];
        unitsArray.forEach(value => {
            switch (value) {
                case 'year':
                    date.push(dateTime.getFullYear());
                    break;
                case 'month':
                    date.push(dateTime.getMonth() + 1);
                    break;
                case 'day':
                    date.push(dateTime.getDate());
                    break;
                case 'hours':
                    time.push(dateTime.getHours().toString().padStart(2, '0'));
                    break;
                case 'minutes':
                    time.push(dateTime.getMinutes().toString().padStart(2, '0'));
                    break;
                case 'seconds':
                    time.push(dateTime.getSeconds().toString().padStart(2, '0'));
                    break;
                default:
                    break;
            }
        });
        let result = '';
        // 年-月-日的格式
        if (date) {
            const dateResult = date.join('-');
            result = + dateResult;
        }
        // 时:分:秒
        if (time) {
            const timeResult = time.join(':');
            result += result === '' ? timeResult : ` ${timeResult}`;
        }
        return result;
    },
    // 节流
    throttle: function (func, wait) {
        // wait:函数间隔调用时间
        let timeout = null, startTime = new Date();
        // 闭包 保留timeout,startTime的状态，让每个返回的独立函数都可以修改并访问他们两个的值
        return function () {
            const curTime = new Date();
            const remaining = wait - (curTime - startTime);
            // 清除定时器
            clearTimeout(timeout);
            // 如果达到了规定的触发时间间隔，触发 handler
            if (remaining <= 0) {
                // 为了让handler能拿到addEventListener回调函数（也就是本函数）的参数
                // 并且也是为了让handler的this指向监听的元素
                func.apply(this, arguments);
                startTime = curTime;
            } else {
                // 没达到触发间隔，设定在remaining时触发 handler
                // 保证最后一次触发事件还能执行一次事件处理函数
                timeout = setTimeout(() => func.apply(this, arguments), remaining);
            }
        };
    },
    //数组里面对象去重
    filterArrayByKey: function (arr, key) {
        // obj对象的作用类似于一个哈希表或字典，用于快速查找已经出现过的id值
        const obj = {};
        // 去重
        arr = arr.reduce((data, current) => {
            // 先判断obj里是否有当前对象的id值的这个属性，没有的话就把id值作为属性存到obj里并且把当前元素添加进数组里
            obj[current[key]] ? '' : obj[current[key]] = true && data.push(current);
            return data;
        }, []);
        return arr;
    },
    //过滤出给定的对象数组中对象里的指定字段
    filterObjectInArray: function (oldData, needKeys) {
        const otherNeedKeys = [];
        const otherNeedValues = [];
        // 取出needKeys包含的对象
        needKeys = needKeys.filter(value => {
            if (value.constructor === Object) {
                // 把对象的键名和键值分别取出来
                otherNeedKeys.push(Object.keys(value)[0]);
                otherNeedValues.push(Object.values(value)[0]);
            }
            else
                return true;
        });
        // 把第一层需要的字段组合起来
        needKeys = [...new Set(needKeys), ...new Set(otherNeedKeys)];
        // 先把第一层的字段过滤出来
        let newData = oldData.map(value => {
            let result = value.constructor === Object ? [value] : value;
            // 如果原来的值是数组，说明里面可能存有多个对象值
            if (Array.isArray(result)) {
                result = result.map(value2 => {
                    const array = Object.entries(value2);
                    // 把本次迭代的对象过滤成键名只有needKeys存放的属性名的对象
                    const tmp = array.filter(value3 => {
                        return needKeys.includes(value3[0]);
                    });
                    return Object.fromEntries(tmp);
                });
            }
            return value.constructor === Object ? result[0] : result;
        });
        // 判断是否需要二次过滤
        if (otherNeedKeys.length !== 0) {
            otherNeedKeys.forEach((value, index) => {
                // 过滤第二层字段
                let tmp = this.filterObjectInArray(newData, [value]);
                // 去掉上面得到的对象数组的键名，只保留键值
                tmp = tmp.map(item => {
                    return item[value];
                });
                // 获取第三层需要过滤的字段
                const tmpNeedKeys = Array.isArray(otherNeedValues[index]) ? otherNeedValues[index] : [otherNeedValues[index]];
                // 用刚才得到的只保留键值的数组继续过滤第三层
                tmp = this.filterObjectInArray(tmp, tmpNeedKeys);
                // 把刚才去掉的键名恢复回来
                tmp = tmp.map(item => {
                    return { [value]: item };
                });
                // 把本层过滤好的字段拷贝覆盖回去总体里
                newData = newData.map((item, index) => {
                    return Object.assign(item, tmp[index])
                });
            })
        }
        return newData;
    },
    // 向对象内层访问取值
    getNestedValue(obj, keys) {
        // 以整个对象作为初始值来向内取值
        const value = keys.reduce((value, currentKey) => {
            // 判断当前的对象是否包含这个路径属性（currentKey）
            // 通过每次拿到的路径属性值来更新对象值，以此来层层访问路径
            if (Object.prototype.hasOwnProperty.call(value, currentKey)) {
                return value[currentKey];
            }
            // 不包含这个路径属性的话也有可能是因为其作为对象内的属性被嵌套进数组（当前对象值）里了
            else if (Array.isArray(value)) {
                // 用于保存数组内所有对象的这个属性的值
                const nestedValues = [];
                // 遍历数组内的所有对象取值
                for (const iterator of value) {
                    if (Object.prototype.hasOwnProperty.call(iterator, currentKey))
                        nestedValues.push(iterator[currentKey]);
                }
                // 把这些值连接为一个字符串，这个字符串作为这个属性的值
                return nestedValues.join(" & ");
            }
        }, obj);
        return value;
    },
    // 替换对象数据的键名
    listDataFormat(data, keyReplace) {
        // keyReplace存放的值对应的是原数据中将被替换的键名（旧键名） 属性对应的是新键名
        return data.map((value) => {
            // 用于保存新数据对象
            const newdata = {};
            for (const current in keyReplace) {
                // 拆分访问路径
                const keys = keyReplace[current].split(".");
                if (keys.length > 1) {
                    // 分离出来的路径有一个以上代表需要向内层访问
                    newdata[current] = this.getNestedValue(value, keys);
                } else {
                    // 新数据对象[新键名] = 原数据对象[旧键名]
                    newdata[current] = value[keyReplace[current]];
                }
            }
            return newdata;
        });
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
