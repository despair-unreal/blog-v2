<!-- 天气图标 -->
<!-- <template>
  <i :class="['iconfont', iconClass, extraClass]"></i>
</template> -->
<script>
const map = {
  dayCloudy: 'icon-duoyun-baitian',
  nightCloudy: 'icon-duoyun-ye'
};
export default {
  functional: true,
  props: {
    icon: {
      type: String,
      required: true
    },
    extraClass: String
  },
  render(h, { props, slots }) {
    const iconClass = map[props.icon];
    return h('i', { class: ['iconfont', iconClass, props.extraClass] }, slots().default);
  }
};
</script>
<style lang='scss' scoped>
@import url('//at.alicdn.com/t/c/font_4557867_urmabqshjwd.css');
.iconfont {
  font-size: inherit;
}
</style>