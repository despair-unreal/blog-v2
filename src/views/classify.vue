<!-- 归类页 -->
<template>
  <Layout>
    <template #main>
      <div class="classify">
        <ItemsTotal />
        <CategoryEcharts />
        <PostEcharts />
        <Category />
        <Tags />
      </div>
    </template>
  </Layout>
</template>

<script>
import Layout from '@/components/global/Layout.vue';
import ItemsTotal from '@/components/classify/ItemsTotal.vue';
import CategoryEcharts from '@/components/classify/CategoryEcharts.vue';
import PostEcharts from '@/components/classify/PostEcharts.vue';
import Category from '@/components/classify/Category.vue';
import Tags from '@/components/classify/Tags.vue';

export default {
  components: {
    Layout,
    ItemsTotal,
    CategoryEcharts,
    PostEcharts,
    Category,
    Tags
  }
};
</script>

<style lang="scss" scoped>
$max-width: 768px;
.classify {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: min-content;
  gap: 40px 24px;
  width: 100%;
  font-size: 16px;
  @media screen and (max-width: $max-width) {
    grid-template-columns: 1fr;
  }
  .echarts {
    min-height: 400px;
    min-width: 0;
  }
  .items-total {
    grid-column: 1 / -1;
  }
  .echarts,
  .category,
  .tags,
  .items-total ::v-deep .item {
    @include block;
  }
}
</style>