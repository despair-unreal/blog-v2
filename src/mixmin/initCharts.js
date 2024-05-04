// 初始化echarts
import { init } from 'echarts/core';
import { debounce } from '@/utils/util';

const map = new WeakMap();
const observer = new ResizeObserver(
  debounce(
    entries => {
      for (const entry of entries) {
        const handler = map.get(entry.target).resize;
        handler && handler();
      }
    },
    200,
    true
  )
);
export default {
  directives: {
    initCharts: {
      inserted(el, { value }) {
        //生成echarts图表
        const chart = init(el);
        value && chart.setOption(value);
        map.set(el, { resize: chart.resize, dispose: chart.dispose });
        //监听dom大小变化
        observer.observe(el);
      },
      unbind(el) {
        //取消监听
        observer.disconnect();
        //销毁图表实例
        const handler = map.get(el).dispose;
        handler && handler();
      }
    }
  }
};
