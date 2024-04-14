<!-- 侧边栏 -->
<template>
  <div class="sidebar">
    <Info />
    <RecentArticle />
    <Category />
    <Tags />
  </div>
</template>

<script>
import Info from './Info.vue';
import RecentArticle from './RecentArticle.vue';
import Category from './Category.vue';
import Tags from './Tags.vue';
export default {
  components: { Info, RecentArticle, Category, Tags }
};
</script>
<style lang="scss" scoped>
</style>
