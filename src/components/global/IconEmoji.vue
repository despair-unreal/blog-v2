<!-- emoji表情 -->
<!-- <template>
  <i :class="['iconfont', iconClass, extraClass]"></i>
</template> -->
<script>
const map = {
  smile: 'icon-weixiao',
  passAway: 'icon-qushi',
  cry: 'icon-ku1',
  happy: 'icon-daxiao',
  LaughCry: 'icon-xiaoku'
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
@import url('//at.alicdn.com/t/c/font_4557847_ccogit3knoe.css');
.iconfont {
  font-size: inherit;
}
</style>