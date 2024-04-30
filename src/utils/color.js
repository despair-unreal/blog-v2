// 预设格式
const _allFormat = ['html', 'rgb', 'rgba', 'hsl'];
// 存储所有转换格式的方法
// 键名是要转换的格式，键值存储键名转换为指定格式的方法
const _fn = {
  rgba: { html: rgbaToHtml },
  html: { rgb: htmlToRgb },
  rgb: { html: rgbaToHtml, rgba: rgbToRgba, hsl: rgbToHsl, cmyk: '', hsv: '' },
  hsl: { rgba: hslToRgba },
  cmyk: { rgb: '' },
  hsv: { rgb: '' }
};
// 检查所给格式是否存在预设中，并把所给格式统一转小写
function _checkFormat(format) {
  if (typeof format !== 'string') return false;
  const allFormat = _allFormat;
  const finalFormat = format.trim().toLowerCase();
  // 判断颜色值是否合法，指定格式是否为预设好的格式
  return allFormat.some(v => finalFormat === v) ? finalFormat : false;
}
// 判断颜色值的格式并检查格式是否合法
export function getFormat(color) {
  if (typeof color !== 'string') return;
  const format = {
    html: /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/,
    rgb: /^rgb\((\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,){2}\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*\)$/i,
    rgba: /^rgba\((\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,){2}\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([0]|[0]?(\.\d+)|1(\.0+)?)\s*\)$/i,
    hsl: /^(hsla?\(\s*((([0-2]?[0-9]?[0-9]|3[0-5][0-9]|360)(deg)?)(\s*,\s*((\d{1,2}|100)%)){2}\s*(,\s*([0]|[0]?(\.\d+)|1(\.0+)?))?)\s*\))|(hsla?\(\s*((([0-2]?[0-9]?[0-9]|3[0-5][0-9]|360)(deg)?)(\s*\s\s*((\d{1,2}|100)%)){2}\s*(\/\s*([0]|[0]?(\.\d+)|1(\.0+)?))?)\s*\))$/i
  };
  const colorFormat = Object.entries(format).find(([, value]) => {
    return value.test(color);
  });
  return colorFormat && colorFormat[0];
}
// 将给定的颜色值转换为指定的格式
// 注意：要把其他格式转为rgba必须带上参数alpha
export function changeFormat(color, format, alpha = 1) {
  const colorFormat = getFormat(color);
  const finalFormat = _checkFormat(format);
  if (!colorFormat || !finalFormat) return;
  if (colorFormat === finalFormat) return color;
  // 判断是否能直接转化格式
  if (_fn[colorFormat][finalFormat]) return _fn[colorFormat][finalFormat](color, alpha);
  // 迭代看要怎么通过哪几个格式来间接转换
  const intermediateFormats = [colorFormat];
  let intervalFormat = colorFormat;
  while (intervalFormat !== finalFormat) {
    // 判断是否存在 finalFormat 键
    if (Object.prototype.hasOwnProperty.call(_fn[intervalFormat], finalFormat)) {
      // 值为空说明没有转换方法，直接脱出循环
      if (!_fn[intervalFormat][finalFormat]) break;
      intervalFormat = finalFormat;
    } else {
      // 找到可以转换的格式
      intervalFormat = Object.keys(_fn[intervalFormat]).find(key => _fn[intervalFormat][key]);
      if (!intervalFormat) break;
    }
    intermediateFormats.push(intervalFormat);
  }
  // 判断是否包含转为最终格式的方法
  if (!intermediateFormats.includes(finalFormat)) return;
  // 最后一个元素为最终格式，不需要执行转换方法
  intermediateFormats.pop();
  // 一个一个执行数组里的函数，执行完一次就把函数结果作为下一个函数的参数传入
  const res = intermediateFormats.reduce((pre, key, index) => {
    const nextFormat = intermediateFormats[index + 1] || finalFormat;
    return _fn[key][nextFormat](pre, alpha);
  }, color);
  return res;
}
// 匹配单个值
export function getSingle(color) {
  return color.match(/(\d+(\.\d+)?|\.\d+)/g);
}
export function rgbaToHtml(color) {
  if (!['rgb', 'rgba'].some(v => v === getFormat(color))) return;
  const rgba = color.match(/(\d+(\.\d+)?|\.\d+)/g);
  const a = parseFloat(rgba[3] || 1);
  let result = '#';
  // 透过图像A（带透明度的图像）看图像B（不带透明度），图像A在图像B的上方
  const backColor = [255, 255, 255];
  rgba.slice(0, 3).forEach((value, index) => {
    // 半透明混合公式/Alpha混合公式/线性插值公式：R(A)*alpha + (1-alpha)*R(B)
    const blend = Math.floor(value * a + (1 - a) * backColor[index]).toString(16);
    result += blend.padStart(2, '0');
  });
  return result;
}
export function rgbToRgba(color, alpha = 1) {
  if ('rgb' !== getFormat(color) || +alpha < 0 || +alpha > 1) return;
  const [r, g, b] = getSingle(color);
  return `rgba(${r},${g},${b},${alpha})`;
}
export function htmlToRgb(color) {
  if ('html' !== getFormat(color)) return;
  let r, g, b;
  if (color.length === 7) {
    r = parseInt(color.substring(1, 3), 16);
    g = parseInt(color.substring(3, 5), 16);
    b = parseInt(color.substring(5, 7), 16);
  } else if (color.length === 4) {
    r = parseInt(`${color[1]}${color[1]}`, 16);
    g = parseInt(`${color[2]}${color[2]}`, 16);
    b = parseInt(`${color[3]}${color[3]}`, 16);
  }
  return `rgb(${r},${g},${b})`;
}
export function rgbToHsl(color, alpha = 1) {
  if ('rgb' !== getFormat(color) || +alpha < 0 || +alpha > 1) return;
  const rgb = getSingle(color);
  const r = rgb[0] / 255,
    g = rgb[1] / 255,
    b = rgb[2] / 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;
  if (max == min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);
  return `hsl(${h}deg ${s}% ${l}% / ${alpha})`;
}
export function hslToRgba(color) {
  if ('hsl' !== getFormat(color)) return;
  let [h, s, l, alpha = 1] = getSingle(color);
  h /= 360;
  s /= 100;
  l /= 100;
  let r,
    g,
    b,
    a = alpha;
  if (s == 0) {
    r = g = b = Math.round(l * 255);
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const fn = t => {
      let res;
      if (t < 0) t += 1;
      else if (t > 1) t -= 1;
      if (t < 1 / 6) res = p + (q - p) * 6 * t;
      else if (t < 1 / 2) res = q;
      else if (t < 2 / 3) res = p + (q - p) * (2 / 3 - t) * 6;
      else res = p;
      return Math.round(res * 255);
    };
    r = fn(h + 1 / 3);
    g = fn(h);
    b = fn(h - 1 / 3);
  }
  return `rgba(${r},${g},${b},${a})`;
}
// 随机生成指定格式的颜色值，默认html
// 可以指定颜色值的部分数值（headStr）,仅接受以#开头的字符串或者{r，g，b}/{h,s,l}填值
// alpha可选
export function randomColor(format = 'html', headStr, alpha) {
  if (!_checkFormat(format)) return;
  const a = alpha || (headStr && headStr.a) || Math.random().toFixed(2);
  let color = randomHtml(headStr);
  if (Object.prototype.toString.call(headStr) === '[object Object]') {
    const keys = Object.keys(headStr);
    const find = arr => keys.some(v => arr.includes(v));
    const isRgb = find(['r', 'g', 'b']);
    if (!isRgb) {
      const isHsl = find(['h', 's', 'l']);
      if (isHsl) color = randomHsl(headStr, alpha);
    } else color = randomRgb(headStr);
  }
  return changeFormat(color, format, a);
}
export function randomHtml(headStr = '#') {
  let res = typeof headStr === 'string' && headStr.trim().startsWith('#') ? headStr.trim() : '#';
  while (res.length < 7) {
    res += Math.floor(Math.random() * 256).toString(16);
  }
  res = res.substring(0, 7);
  // 判断值是否合法
  return getFormat(res) ? res : undefined;
}
export function randomRgb(parameter = {}) {
  const fn = () => Math.floor(Math.random() * 256);
  let { r, g, b } = parameter;
  const res = `rgb(${r ?? fn()},${g ?? fn()},${b ?? fn()})`;
  return getFormat(res) ? res : undefined;
}
export function randomHsl(parameter = {}, alpha) {
  let { h, s, l } = parameter;
  const random = limit => Math.floor(Math.random() * (limit + 1));
  h = h ?? random(360);
  s = s ?? random(100);
  l = l ?? random(100);
  const res = `hsl(${h}deg ${s}% ${l}%${alpha ? ' / ' + alpha : ''})`;
  return getFormat(res) ? res : undefined;
}
