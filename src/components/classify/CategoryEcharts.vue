<!-- 文章分类图表（二级） -->
<template>
  <div class="echarts" v-initCharts="option"></div>
</template>

<script>
import initCharts from '@/mixmin/initCharts.js';
import * as echarts from 'echarts/core';
import {
  TooltipComponent,
  DatasetComponent,
  ToolboxComponent,
  LegendComponent,
  TransformComponent
} from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { randomColor } from '@/utils/color.js';
echarts.use([
  TooltipComponent,
  DatasetComponent,
  ToolboxComponent,
  LegendComponent,
  TransformComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout
]);
function getRandomColor(quantity) {
  const colors = new Set();
  for (let i = 0; colors.size !== quantity; i++) {
    const h = Math.floor(Math.random() * 161 + 200);
    const l = Math.floor(Math.random() * 91);
    colors.add(randomColor('html', { h, l }));
  }
  return [...colors];
}
const option = {
  // 提示框组件
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  // 工具栏
  toolbox: {
    show: true,
    feature: {
      dataView: { show: true, readOnly: true },
      saveAsImage: { show: true }
    }
  },
  // 数据集
  dataset: [
    {
      source: [
        { value: 3, name: 'rose 1' },
        { value: 28, name: 'rose 2' },
        { value: 26, name: 'rose 3' },
        { value: 24, name: 'rose 4' },
        { value: 22, name: 'rose 5' },
        { value: 20, name: 'rose 6' },
        { value: 18, name: 'rose 7' },
        { value: 16, name: 'rose 8' }
      ]
    },
    {
      transform: {
        type: 'sort',
        config: { dimension: 'value', order: 'desc' }
      }
    }
  ],
  // 图表配置
  series: [
    {
      type: 'pie',
      name: 'Nightingale Chart',
      // 内外圈半径
      radius: ['20%', '90%'],
      // 图表展现数据的模式
      roseType: 'area',
      // 图形样式
      itemStyle: {
        borderRadius: 8
      },
      // 文本标签
      label: {
        // $font-4
        color: '#a9a9a9'
      },
      datasetIndex: 1
    }
  ]
};
option.color = getRandomColor(option.dataset[0].source.length);
export default {
  mixins: [initCharts],
  data() {
    return {
      option
    };
  }
};
</script>
