<!-- 分类 -->
<template>
  <SideBlock>
    <template #icon>
      <Icon icon="grouping"></Icon>
    </template>
    <template #name>
      <span>分类</span>
    </template>
    <template #content>
      <ul class="list">
        <li v-for="item in 8" :key="item">
          <router-link class="list-item" to="">
            <span class="title">hexo</span>
            <span class="num">2</span>
          </router-link>
        </li>
      </ul>
      <MoreButton goLink="/classify" />
    </template>
  </SideBlock>
</template>

<script>
import SideBlock from './SideBlock.vue';
import MoreButton from './MoreButton.vue';
export default {
  components: { SideBlock, MoreButton }
};
</script>

<style lang="scss" scoped>
.list-item {
  display: flex;
  justify-content: space-between;
  padding: 3px 10px;
  transition: all 0.4s;
  &:hover {
    background: $emphasize-black;
    color: #fff;
    padding: 3px 17px;
  }
}
</style>