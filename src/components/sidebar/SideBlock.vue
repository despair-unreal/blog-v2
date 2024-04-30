<!-- 侧边栏每块区域布局 -->
<template>
  <div class="side-block">
    <h2 class="top">
      <slot name="icon"></slot>
      <span class="name">
        <slot name="name"></slot>
      </span>
      <div class="rightTop">
        <slot name="rightTop"></slot>
      </div>
    </h2>
    <slot name="content"></slot>
  </div>
</template>

<script>
</script>
<style lang='scss' scoped>
.side-block {
  @include block;
  .top {
    display: flex;
    align-items: center;
    padding-bottom: 6px;
    font-weight: normal;
    font-size: 20px;
    .name {
      font-size: 16.8px;
      margin-left: 10px;
    }
    .rightTop {
      margin-left: auto;
    }
  }
}
</style>