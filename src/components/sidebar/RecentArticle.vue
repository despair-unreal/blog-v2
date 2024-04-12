<template>
  <SideBlock>
    <template #icon>
      <Icon icon="renewal"></Icon>
    </template>
    <template #name>最新文章</template>
    <template #content>
      <ul>
        <div class="list-item" v-for="item in 6" :key="item">
          <router-link class="title" to="">父子组件的生命周期渲染顺序问题父子组件的生命周期渲染顺序问题</router-link>
          <time class="time" datetime="2021-12-17 09:39" title="发表于 2021-12-17 09:39">2021-12-17 09:39</time>
        </div>
      </ul>
      <MoreButton goLink="/articleOverview" />
    </template>
  </SideBlock>
</template>

<script>
import MoreButton from './MoreButton.vue';
import SideBlock from './SideBlock.vue';

export default {
  components: { MoreButton, SideBlock }
};
</script>

<style lang="scss" scoped>
.list-item {
  padding-left: 10px;
  &:not(:last-child) {
    padding-bottom: 16px;
  }
  .title {
    @include text-overflow(2);
    font-size: 13.4px;
    line-height: 1.6;
    &:hover {
      color: $font-2;
    }
  }
  .time {
    display: block;
    color: $font-3;
    font-size: 12px;
  }
}
</style>>
