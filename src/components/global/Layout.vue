<!-- 布局 -->
<template functional>
  <div>
    <div class="top">
      <slot name="top"></slot>
    </div>
    <div class="mid">
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
.top {
  min-height: 110px;
}
.mid {
  // max-width: 1476px;
  display: flex;
  padding: 0 26px;
  margin: {
    bottom: 40px;
  }
  @media screen and (max-width: $max-width) {
    flex-direction: column;
    padding: 0 15px;
    .left,
    .right {
      width: 100%;
    }
    .right {
      margin-top: 20px;
    }
  }
  .left {
    flex: 1;
  }
  .right {
    &:not(:empty) {
      width: 25%;
      margin-left: 20px;
      @media screen and (max-width: $max-width) {
        width: 100%;
        margin-left: 0px;
      }
    }
  }
}
</style>
