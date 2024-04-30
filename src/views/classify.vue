<!-- 归类页 -->
<template>
  <div class="classify">
    <ItemsTotal />
    <CategoryEcharts />
    <PostEcharts />
    <Category />
    <Tags />
  </div>
</template>

<script>
import ItemsTotal from '@/components/classify/ItemsTotal.vue';
import CategoryEcharts from '@/components/classify/CategoryEcharts.vue';
import PostEcharts from '@/components/classify/PostEcharts.vue';
import Category from '@/components/classify/Category.vue';
import Tags from '@/components/classify/Tags.vue';

export default {
  components: {
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
$block-interval: 24px;
.classify {
  display: flex;
  margin: 0 auto;
  flex-wrap: wrap;
  margin-top: 110px;
  max-width: 1500px;
  font-size: 16px;
  .echarts {
    min-height: 400px;
  }
  .echarts,
  .category,
  .tags,
  .items-total ::v-deep .item {
    @include block;
    margin: 20px calc(#{$block-interval} / 2);
    --block-interval: #{$block-interval};
  }
  .echarts,
  .category,
  .tags {
    width: calc(50% - #{$block-interval});
    @media screen and (max-width: $max-width) {
      width: 100%;
    }
  }
}
</style>