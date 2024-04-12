<template>
  <SideBlock :class="['catalog', { 'no-toc': !tree }, { show: isShowSideCatalog }]">
    <template #icon>
      <Icon icon="list" extraClass="list"></Icon>
    </template>
    <template #name>目录</template>
    <template #rightTop>
      <span class="progress">{{ progress }}</span>
    </template>
    <template #content>
      <div class="toc">
        <TocTree :tree="tree" :activeTitleID="activeTitleID"></TocTree>
      </div>
    </template>
  </SideBlock>
</template>
<script>
import { mapState } from 'vuex';
import SideBlock from '@/components/sidebar/SideBlock.vue';
import TocTree from './CatalogTocTree.vue';
export default {
  components: {
    TocTree,
    SideBlock
  },
  props: {
    progress: {
      type: String,
      default: '0'
    },
    tree: {
      type: Array,
      default: () => []
    },
    activeTitleID: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState(['isShowSideCatalog'])
  }
};
</script>

<style lang="scss" scoped>
.catalog {
  max-height: inherit;
  overflow-y: auto;
  &.no-toc {
    display: none;
  }
  .progress {
    color: $font-4;
    font-size: 24px;
    font-style: italic;
    line-height: 1;
  }
  ::v-deep .list {
    font-weight: bolder;
    line-height: 20px;
  }
  @media screen and (max-width: 900px) {
    position: fixed;
    opacity: 0;
    right: 45px;
    bottom: 30px;
    backdrop-filter: blur(10px);
    transform-origin: right bottom;
    transform: scale(0.7);
    pointer-events: none;
    &.show {
      opacity: 1;
      transform: scale(1);
      pointer-events: auto;
    }
  }
}
</style>