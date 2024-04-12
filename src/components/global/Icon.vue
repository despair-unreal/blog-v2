<!-- 字体图标 -->
<!-- <template>
  <i :class="['iconfont', iconClass, extraClass]"></i>
</template> -->
<script>
const map = {
  top: 'icon-zhiding',
  dividers: 'icon-fenge',
  grouping: 'icon-grouping',
  rightArrow: 'icon-xiangyou1',
  calendar: 'icon-rili',
  browse: 'icon-yueduliang',
  renewal: 'icon-banbengengxin',
  qq: 'icon-qq',
  wechat: 'icon-wechat',
  weibo: 'icon-weibo',
  link: 'icon-lianjie',
  list: 'icon-liebiao'
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
@import url('//at.alicdn.com/t/c/font_3987336_zp2mux0egvi.css');
.iconfont {
  font-size: inherit;
}
</style>