<!-- 切换上一篇/下一篇文章 -->
<template>
  <div class="toggle-btn">
    <ToggleButton class="pre">上一篇</ToggleButton>
    <ToggleButton class="next" direction="right">下一篇</ToggleButton>
  </div>
</template>

<script>
import ToggleButton from './ToggleArticlesBtn.vue';
export default {
  components: {
    ToggleButton
  }
};
</script>
<style lang='scss' scoped>
$max-width: 768px;

.toggle-btn {
  background: black;
  width: 100%;
  overflow: hidden;
  .pre,
  .next {
    float: left;
    height: 150px;
    width: 50%;
    @media screen and (max-width: $max-width) {
      width: 100% !important;
    }
  }
}
</style>