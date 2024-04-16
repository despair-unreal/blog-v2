export default {
  allFormat: ['html', 'rgb', 'rgba'],
  // 判断颜色值的格式并检查格式是否合法
  getFormat(color) {
    if (typeof color !== 'string') return;
    const format = {
      html: /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/,
      rgb: /^rgb\((\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,){2}\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*\)$/i,
      rgba: /^rgba\((\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,){2}\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([0]?(\.\d+)?|1(\.0+)?)\s*\)$/i
    };
    const colorFormat = Object.entries(format).find(([, value]) => {
      return value.test(color);
    });
    return colorFormat && colorFormat[0];
  },
  // 检查格式是否存在预设中
  checkFormat(format) {
    if (typeof format !== 'string') return false;
    const allFormat = this.allFormat;
    const finalFormat = format.trim().toLowerCase();
    // 判断颜色值是否合法，指定格式是否为预设好的格式
    return allFormat.some(v => finalFormat === v) ? finalFormat : false;
  },
  // 将给定的颜色值转换为指定的格式
  // 注意：要把其他格式转为rgba必须带上参数alpha
  changeFormat(color, format, alpha = 1) {
    const colorFormat = this.getFormat(color);
    const finalFormat = this.checkFormat(format);
    if (!colorFormat || !finalFormat) return;
    if (colorFormat === finalFormat) return color;
    const fn = {
      rgba: { html: this.rgbaToHtml, rgb: this.rgbaToRgb },
      html: { rgb: this.htmlToRgb, rgba: this.htmlToRgba },
      rgb: { html: this.rgbaToHtml, rgba: this.rgbToRgba }
    };
    return fn[colorFormat][finalFormat].call(this, color, alpha);
  },
  rgbaToHtml(color) {
    if (!['rgb', 'rgba'].some(v => v === this.getFormat(color))) return;
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
  },
  rgbaToRgb(color) {
    if ('rgba' !== this.getFormat(color)) return;
    return this.htmlToRgb(this.rgbaToHtml(color));
  },
  rgbToRgba(color, alpha = 1) {
    if ('rgb' !== this.getFormat(color) || +alpha < 0 || +alpha > 1) return;
    const [r, g, b] = color.match(/\d+/g);
    return `rgba(${r},${g},${b},${alpha})`;
  },
  htmlToRgb(color) {
    if ('html' !== this.getFormat(color)) return;
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
  },
  htmlToRgba(color, alpha = 1) {
    if ('html' !== this.getFormat(color) || +alpha < 0 || +alpha > 1) return;
    return this.rgbToRgba(this.htmlToRgb(color), alpha);
  },
  // 随机生成指定格式的颜色值，默认html
  // 可以指定颜色值的部分数值（headStr）,仅接受以#开头的字符串或者{r，g，b，a}填值
  // alpha可选
  randomColor(format = 'html', headStr, alpha) {
    if (!this.checkFormat(format)) return;
    if (headStr && typeof headStr !== 'string' && Object.prototype.toString.call(headStr) !== '[object Object]') return;
    let color;
    if (headStr && Object.prototype.toString.call(headStr) == '[object Object]') {
      color = this.randomRgb(headStr);
    } else color = this.randomHtml(headStr);
    const a = alpha || (headStr && headStr.a) || Math.random().toFixed(2);
    return this.changeFormat(color, format, a);
  },
  randomHtml(headStr = '#') {
    let res = headStr.trim();
    if (!res.startsWith('#')) return;
    while (res.length < 7) {
      const random = Math.floor(Math.random() * 256).toString(16);
      res += random;
    }
    res = res.substring(0, 7);
    // 判断值是否合法
    return this.getFormat(res) ? res : undefined;
  },
  randomRgb({ r = '', g = '', b = '' }) {
    const red = r || Math.floor(Math.random() * 256);
    const green = g || Math.floor(Math.random() * 256);
    const blue = b || Math.floor(Math.random() * 256);
    const res = `rgb(${red},${green},${blue})`;
    return this.getFormat(res) ? res : undefined;
  }
};
