<!-- 交互 -->
<template>
  <div class="interaction">
    <div class="thumbsUp">
      <Icon icon="thumbsUp" extraClass="black" />
      <Icon icon="thumbsUp" extraClass="flow" />
    </div>
    <div class="comments">
      <Icon icon="comments" extraClass="black" />
      <Icon icon="comments" extraClass="flow" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>
<style lang='scss' scoped>
.thumbsUp,
.comments {
  float: left;
  margin: 0 9px;
  font-weight: bolder;
  position: relative;
  &:hover {
    ::v-deep {
      .black {
        opacity: 0;
      }
      .flow {
        opacity: 1;
      }
    }
  }
  ::v-deep {
    .black {
      opacity: 1;
      transition: opacity 0.3s linear;
    }
    .flow {
      opacity: 0;
      position: absolute;
      left: 0;
      @include text-background(linear-gradient(45deg, #fbc7d4, #9796f0, #fbc7d4, #9796f0));
      background-repeat: no-repeat;
      background-size: 300% 300%;
      background-position: 0% 100%;
      transition: opacity 0.3s linear;
      animation: move 1s linear 0.3s infinite;
    }
    @keyframes move {
      0% {
        background-position: 0% 100%;
      }
      100% {
        background-position: 100% 0%;
      }
    }
  }
}
</style>