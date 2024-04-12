<template>
  <router-link class="see-more-btn" :to="goLink">
    <span class="text">查看更多</span>
    <Icon icon="rightArrow" />
  </router-link>
</template>

<script>
export default {
  props: {
    goLink: {
      type: String,
      default: ''
    }
  }
};
</script>

<style lang="scss" scoped>
.see-more-btn {
  display: block;
  width: 100%;
  padding: 3px 0;
  margin-top: 10px;
  text-align: center;
  transition: background 0.4s;
  .text {
    padding-right: 6px;
    transition: padding 0.4s;
  }
  &:hover {
    .text {
      padding-right: 12px;
    }
    color: #fff;
    background: #1f2d3d;
  }
}
</style>