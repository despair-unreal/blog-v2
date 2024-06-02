<!-- 顶部相关信息 -->
<template>
  <div class="msg">
    <IconEmoji icon="smile" extraClass="mood" />
    <time class="date">5月14日</time>
    <span class="temperature">25 ℃</span>
    <IconWeather icon="dayCloudy" extraClass="weather" />
  </div>
</template>

<script>
import IconEmoji from '@/components/global/IconEmoji.vue';
import IconWeather from '@/components/global/IconWeather.vue';
export default {
  data() {
    return {};
  },
  components: { IconEmoji, IconWeather }
};
</script>
<style lang='scss' scoped>
.msg {
  position: relative;
  margin-bottom: 24px;
  ::v-deep {
    .mood {
      margin-right: 8px;
    }
    .weather {
      position: absolute;
      right: -20px;
      top: -20px;
      font-size: 72px;
      line-height: 1;
      transform: rotateZ(10deg);
      @extend .gradient;
    }
  }
  .date {
    margin-right: 14px;
    @extend .gradient;
  }
  .temperature {
    @extend .gradient;
  }
  /*实现文字颜色线性渐变效果*/
  .gradient {
    @include text-background(linear-gradient(to right, #fbc7d4, #9796f0));
  }
}
</style>