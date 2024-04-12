<!-- 文章标签 -->
<template>
  <div class="tags">
    <router-link class="tags-item" to="" v-for="item in 23" :key="item">课程</router-link>
  </div>
</template>

<script>
export default {};
</script>
<style lang='scss' scoped>
.tags {
  .tags-item {
    display: block;
    float: left;
    margin: 8px 8px 8px 0;
    padding: 0 12px;
    border: 1px solid $font-2 {
      radius: 12px;
    }
    font-size: 12px;
    color: $font-2;
    transition: all 0.2s ease-in-out;
    &:hover {
      background: $font-2;
      color: #fff;
    }
  }
}
</style>