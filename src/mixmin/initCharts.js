// 初始化echarts
import { init } from 'echarts/core';

export default {
  data() {
    return {
      chart: undefined,
      observer: undefined
    };
  },
  directives: {
    initCharts: {
      inserted(el, { value }, vnode) {
        const that = vnode.context;
        //生成echarts图表
        that.chart = init(el);
        value && that.chart.setOption(value);
        //监听dom大小变化
        const debounceFn = that.$utils.debounce(that.chart.resize, 200, true);
        that.observer = new ResizeObserver(debounceFn);
        that.observer.observe(el);
      },
      unbind(el, binding, vnode) {
        const that = vnode.context;
        //取消监听
        that.observer.disconnect();
        //销毁图表实例
        that.chart.dispose();
      }
    }
  }
};
