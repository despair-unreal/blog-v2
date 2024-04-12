<!-- 布局 top插槽为空时为mid加上上边距 -->
<template functional>
  <div>
    <div class="top">
      <slot name="top"></slot>
    </div>
    <div class="mid" :class="{ margin: !$slots.top || $slots.top.length === 0 }">
      <main class="left">
        <slot name="main"></slot>
      </main>
      <div class="right">
        <slot name="aside"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
$max-width: 900px;
.mid {
  max-width: 1200px;
  display: flex;
  padding: 0 15px;
  margin: {
    // top: 110px;
    bottom: 40px;
    left: auto;
    right: auto;
  }
  &.margin {
    margin-top: 110px;
  }
  @media screen and (max-width: $max-width) {
    flex-direction: column;
    > * {
      width: 100% !important;
    }
    > *:not(:first-child) {
      margin-top: 20px;
    }
  }
  .left {
    width: 75%;
  }
  .right {
    width: 25%;
    margin-left: 15px;
    @media screen and (max-width: $max-width) {
      margin-left: 0px;
    }
  }
}
</style>
