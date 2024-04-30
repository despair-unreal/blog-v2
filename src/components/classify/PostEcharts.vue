<!-- 文章数-日期图表 -->
<template>
  <div class="echarts" v-initCharts="option"></div>
</template>

<script>
import initCharts from '@/mixmin/initCharts.js';
import * as echarts from 'echarts/core';
import {
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  MarkLineComponent,
  DatasetComponent
} from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
echarts.use([
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  MarkLineComponent,
  DatasetComponent,
  BarChart,
  CanvasRenderer
]);
const xAxisData = [];
const postCount = [];
// 距今过去几年的年月
const now = new Date();
const passYear = 2;
now.setFullYear(now.getFullYear() - passYear);
for (let i = 0; i < 12 * passYear; i++) {
  const month = now.getMonth() + 1;
  const post = postCount.length % 2 == 0 ? Math.floor(Math.random() * 30) : 0;
  postCount.push(post);
  xAxisData.push(`${now.getFullYear()}-${month.toString().padStart(2, '0')}`);
  now.setMonth(month);
}
const option = {
  color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
    {
      offset: 0,
      color: '#fbc7d4'
    },
    {
      offset: 1,
      color: '#9796f0'
    }
  ]),
  // 提示框组件
  tooltip: {
    trigger: 'axis',
    formatter: function (params) {
      let res;
      for (let i = 0, l = params.length; i < l; i++) {
        res =
          params[i].name +
          '<br/>' +
          params[i].marker +
          params[i].seriesName +
          '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
          `<strong>${params[i].value}</strong>`;
      }
      return res;
    }
  },
  // 工具栏
  toolbox: {
    show: true,
    feature: {
      dataView: { show: true, readOnly: true },
      saveAsImage: { show: true }
    }
  },
  xAxis: [
    {
      type: 'category',
      name: '日期',
      data: xAxisData,
      axisTick: {
        show: false
      },
      axisLine: {
        lineStyle: {
          // $font-4
          color: '#a9a9a9'
        }
      }
    }
  ],
  yAxis: [
    {
      name: '文章数',
      type: 'value',
      axisLine: {
        show: true,
        lineStyle: {
          // $font-4
          color: '#a9a9a9'
        }
      },
      splitLine: {
        show: false
      }
    }
  ],
  // 图表配置
  series: [
    {
      name: '文章数',
      type: 'bar',
      markLine: {
        data: [{ type: 'average', name: 'Avg' }],
        label: {
          color: '#a9a9a9'
        }
      },
      itemStyle: {
        borderRadius: 20
      },
      data: postCount
    }
  ]
};
export default {
  mixins: [initCharts],
  data() {
    return {
      option
    };
  }
};
</script>
<style lang='scss' scoped>
</style>