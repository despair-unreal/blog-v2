<template>
  <main class="card-box">
    <div ref="echarts" class="echarts"></div>
    <div class="category">
      <h2>分类 - 6</h2>
      <ul>
        <li v-for="item in 6" :key="item">
          <router-link to="">技术</router-link>
          <span>(4)</span>
          <ul>
            <li v-for="item in 6" :key="item">
              <router-link to="">技术</router-link>
              <span>(4)</span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="tags">
      <h2>标签 - 9</h2>
      <router-link
        :style="{
          color: $utils.randomColor('html', '#999'),
          fontSize: randomFontSize(),
        }"
        v-for="item in 20"
        :key="item"
        to=""
        >3D</router-link
      >
    </div>
  </main>
</template>

<script>
import * as echarts from "echarts";

export default {
  data() {
    return {
      chart: null,
      observer: null,
    };
  },
  methods: {
    //生成随机字体大小
    randomFontSize: function () {
      const size = (Math.random() * 10 + 14.28).toFixed(2) + "px";
      return size;
    },
    //生成echarts图表
    setEcharts: function () {
      const option = {
        title: {
          text: "文章一级分类图",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        dataset: [
          {
            source: [
              { value: 3, name: "rose 1" },
              { value: 28, name: "rose 2" },
              { value: 26, name: "rose 3" },
              { value: 24, name: "rose 4" },
              { value: 22, name: "rose 5" },
              { value: 20, name: "rose 6" },
              { value: 18, name: "rose 7" },
              { value: 16, name: "rose 8" },
            ],
          },
          {
            transform: [
              {
                type: "sort",
                config: { dimension: "value", order: "asc" },
              },
            ],
          },
        ],
        series: [
          {
            name: "Nightingale Chart",
            type: "pie",
            radius: [30, 150],
            roseType: "area",
            itemStyle: {
              borderRadius: 8,
            },
            datasetIndex: 1,
          },
        ],
      };
      this.chart = echarts.init(this.$refs.echarts, null, {
        renderer: "canvas",
        useDirtyRect: false,
      });
      this.chart.setOption(option);
      //监听dom大小变化
      this.observer = new ResizeObserver(() => {
        this.chart.resize();
      });
      this.observer.observe(this.$refs.echarts);
    },
  },
  mounted() {
    //生成echarts图表
    this.setEcharts();
  },
  beforeDestroy() {
    //取消监听
    this.observer.disconnect();
    //销毁图表实例
    this.chart.dispose();
  },
};
</script>

<style scoped>
main {
  padding: 50px 40px;
}
main > div {
  border: 2px solid #a4b0be;
  border-radius: 5px;
  padding: 20px;
}
main > div:not(:last-child) {
  margin-bottom: 20px;
}
main > div > h2 {
  font-weight: normal;
  font-size: 36px;
  text-align: center;
}
.echarts {
  height: 450px;
}
.category > ul {
  display: flex;
  flex-wrap: wrap;
  margin-top: 8px;
}
.category ul {
  list-style: none;
}
.category ul ul {
  padding-left: 4px;
}
.category > ul > li {
  flex-grow: 1;
}
.category ul li {
  position: relative;
  padding-left: 19.6px;
  margin: 6px 0;
}
.category ul li::before {
  content: "";
  position: absolute;
  top: 9.8px;
  left: 0;
  width: 6px;
  height: 6px;
  border: 2px solid #797979;
  border-radius: 50%;
  transition: all 0.3s ease-out;
}
.category ul li:hover::before {
  border-color: #ff7242;
}
.category ul li a:hover {
  color: #797979;
}
.category ul li span {
  margin-left: 8px;
  color: #858585;
}
.tags {
  text-align: center;
}
.tags a {
  display: inline-block;
  border-radius: 5px;
  margin: 0 2px;
  padding: 2px 10px;
}
.tags a:hover {
  color: #797979 !important;
  background: #e1e3e6;
  transform: scale(1.1);
}
</style>