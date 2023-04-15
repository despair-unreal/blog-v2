<template>
  <div class="tags card-box">
      <h2>
        <i class="iconfont icon-24gf-tags"></i>
        <span>标签</span>
      </h2>
      <div class="tag-group">
        <router-link
          :style="{ color: $utils.randomColor('html', '#999') }"
          v-for="item in 6"
          :key="item"
          to=""
          >吐槽</router-link
        >
      </div>
    </div>
</template>

<script>
export default {

}
</script>

<style>
.tags .tag-group a {
  font-size: 15.4px;
  padding: 0 4px;
}
.tags .tag-group a:hover {
  color: #797979 !important;
}
</style>