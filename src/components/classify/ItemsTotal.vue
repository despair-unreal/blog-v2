<!-- 各项总数 -->
<template>
  <div class="items-total">
    <div class="item">
      <div class="description">
        <div class="title">本站访客数</div>
        <div class="count">54</div>
      </div>
    </div>
    <div class="item">
      <div class="description">
        <div class="title">本站总访问量</div>
        <div class="count">54</div>
      </div>
    </div>
    <div class="item">
      <div class="description">
        <div class="title">标签总数</div>
        <div class="count">54</div>
      </div>
    </div>
    <div class="item">
      <div class="description">
        <div class="title">文章总数</div>
        <div class="count">54</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>
<style lang='scss' scoped>
.items-total {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  flex-wrap: wrap;
  @media screen and (max-width: 768px) {
    grid-template: repeat(2, 1fr) / repeat(2, 1fr);
  }
  .item {
    .description {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 80px;
      margin: 20px 0;
      padding: {
        left: 20px;
      }
      border-left: 2.4px solid rgba(155, 155, 155, 0.5);
      .title {
        color: $font-4;
        line-height: 1.2;
      }
      .count {
        font-size: 32px;
        line-height: 1;
        color: $emphasize-black;
      }
    }
  }
}
</style>