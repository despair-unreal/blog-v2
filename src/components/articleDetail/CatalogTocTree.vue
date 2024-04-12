<!-- 目录树 -->
<!-- level为目录编号：第一层级的level为空，level一层一层传递下去，每层都要加上自己的index -->
<template functional>
  <ol :class="{ 'level-one': !props.level }">
    <li v-for="(item, index) in props.tree" :key="item.index" :class="{ active: props.activeTitleID === item.id }">
      <a :href="`#${item.id}`">
        <span class="number">{{ props.level + (index + 1) }}.&nbsp;</span>
        <span class="content">{{ item.title }}</span>
      </a>
      <TocTree
        v-if="item.children"
        :level="`${props.level + (index + 1)}.`"
        :tree="item.children"
        :activeTitleID="props.activeTitleID"
      ></TocTree>
    </li>
  </ol>
</template>

<script>
export default {
  name: 'TocTree',
  props: {
    tree: Array,
    level: {
      type: String,
      default: ''
    },
    activeTitleID: String
  }
};
</script>
<style lang='scss' scoped>
ol {
  display: none;
  padding-left: 8px;
  &.level-one,
  &:has(.active),
  .active ol {
    display: block;
  }
  &.level-one {
    padding-left: 0px;
  }
  li {
    list-style: none;
    &.active > a {
      border-left-color: #009d92;
      background: #00c4b6;
      color: #fff;
    }
    a {
      display: block;
      padding-left: 6px;
      border-left: 3px solid transparent;
      transition: all 0.2s ease-in-out;
    }
  }
}
</style>