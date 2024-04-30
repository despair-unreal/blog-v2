<!-- 标签 -->
<template>
  <div class="tags">
    <!-- <h2 class="title">标签 - 9</h2> -->
    <div class="items">
      <router-link
        class="item"
        :style="{
          color: $utils.color.randomColor('html', '#999'),
          fontSize: randomFontSize()
        }"
        v-for="item in 20"
        :key="item"
        to=""
      >
        3D
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    //生成随机字体大小
    randomFontSize: function () {
      return (Math.random() * 10 + 14.28).toFixed(2) + 'px';
    }
  }
};
</script>
<style lang='scss' scoped>
.tags {
  display: flex;
  flex-direction: column;
  .items {
    display: flex;
    height: 100%;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    align-content: center;
    .item {
      border-radius: 6px;
      margin: 0 2px;
      padding: 2px 10px;
      &:hover {
        color: $font-2 !important;
        background: #e1e3e6;
        transform: scale(1.1);
      }
    }
  }
}
</style>