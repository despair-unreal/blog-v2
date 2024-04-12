<!-- 切换文章按钮 -->
<template>
  <router-link class="btn" :style="textDirectionStyle" to="">
    <img class="cover" src="@/assets/images/crowd-loading/crowd-background.jpg" alt="cover of previous article" />
    <div class="text">
      <span class="btn-name">
        <slot></slot>
      </span>
      <span class="title">
        这里是标题标题这里是标题标题这里是标题标题这里是标题标题这里是标题标题这里是标题标题这里是标题标题这里是标题标题这里是标题标题这里是标题标题这里是标题标题这里是标题标题这里是标题标题这里是标题标题这里是标题标题这里是标题标题这里是标题标题这里是标题标题这里是标题标题这里是标题标题这里是标题标题这里是标题标题这里是标题标题这里是标题标题
      </span>
    </div>
  </router-link>
</template>

<script>
export default {
  props: {
    direction: {
      type: String,
      default: 'left'
    }
  },
  computed: {
    textDirectionStyle() {
      return { textAlign: this.direction };
    }
  }
};
</script>
<style lang='scss' scoped>
.btn {
  position: relative;
  width: 100%;
  height: 100%;
  display: block;
  overflow: hidden;
  &:hover {
    .cover {
      opacity: 0.8;
      transform: scale(1.1);
    }
  }
  .cover {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.4;
    transition: all 0.6s;
  }
  .text {
    position: absolute;
    top: 50%;
    padding: 20px 40px;
    width: 100%;
    transform: translate(0, -50%);
    .btn-name {
      font-size: 12.6px;
      color: #eee;
    }
    .title {
      color: #fff;
      font-weight: 500;
      @include text-overflow(2);
    }
  }
}
</style>