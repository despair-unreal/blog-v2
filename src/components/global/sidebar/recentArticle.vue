<template>
  <div class="recent-article card-box">
    <h2>
      <i class="iconfont icon-banbengengxin"></i>
      <span>最新文章</span>
    </h2>
    <div v-for="item in 6" :key="item" class="list-item">
      <router-link class="text-overflow" to="">
        父子组件的生命周期渲染顺序问题父子组件的生命周期渲染顺序问题
      </router-link>
      <time datetime="2021-12-17 09:39" title="发表于 2021-12-17 09:39"
        >2021-12-17 09:39</time
      >
    </div>
    <moreButtom :goLink="'/articleOverview'"></moreButtom>
  </div>
</template>

<script>
import moreButtom from './moreButtom.vue';
export default {
  components: { moreButtom }};
</script>

<style scoped>
.recent-article .list-item {
  padding-left: 10px;
}
.recent-article .list-item:not(:last-child) {
  padding-bottom: 16px;
}
.recent-article .list-item a {
  -webkit-line-clamp: 2;
  font-size: 13.4px;
  line-height: 1.5;
}
.recent-article .list-item a:hover {
  color: #797979;
}
.recent-article .list-item time {
  display: block;
  color: #858585;
  font-size: 12px;
}
</style>>
