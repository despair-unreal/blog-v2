<!-- 标签 -->
<template>
  <SideBlock>
    <template #icon>
      <Icon icon="tags"></Icon>
    </template>
    <template #name>
      <span>标签</span>
    </template>
    <template #content>
      <div>
        <router-link
          :style="`color:${$utils.color.randomColor('html', '#999')}`"
          class="tag"
          v-for="item in 6"
          :key="item"
          to=""
        >
          吐槽
        </router-link>
      </div>
    </template>
  </SideBlock>
</template>

<script>
import SideBlock from './SideBlock.vue';

export default {
  components: { SideBlock },
  created() {
    window.that = this;
    window.thatColor = this.$utils.color;
  }
};
</script>

<style lang="scss" scoped>
.tag {
  font-size: 15.4px;
  padding: 0 4px;
  word-break: keep-all;
  &:hover {
    color: $font-2 !important;
  }
}
</style>