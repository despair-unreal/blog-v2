<!-- 文章信息：时间、分类、阅读量等 -->
<template>
  <div class="meta">
    <div v-if="sticky" class="sticky">
      <Icon icon="top" extraClass="top bold"></Icon>
      <span class="name">置顶</span>
      <Icon icon="dividers" extraClass="dividers"></Icon>
    </div>
    <div class="category">
      <Icon icon="grouping"></Icon>
      <router-link class="name" to="">游戏记录</router-link>
      <Icon icon="rightArrow" extraClass="bold"></Icon>
      <router-link class="name" to="">记录</router-link>
      <Icon icon="dividers" extraClass="dividers"></Icon>
    </div>
    <div class="date">
      <time title="发表于 2021-12-06">
        <Icon icon="calendar"></Icon>
        <span class="name">发表于16个月前</span>
      </time>
      <Icon icon="dividers" extraClass="dividers"></Icon>
    </div>
    <div class="readership">
      <Icon icon="browse" extraClass="bold"></Icon>
      <span class="name">阅读量：255</span>
      <Icon icon="dividers" extraClass="dividers"></Icon>
    </div>
    <div class="date">
      <time title="更新于 2021-12-10">
        <Icon icon="renewal"></Icon>
        <span class="name">更新于15个月前</span>
      </time>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sticky: true
    };
  }
  /* computed: {
    sticky: function () {
      return this.$route.path === '/article';
    }
  } */
};
</script>

<style lang="scss" scoped>
$topColor: #ff7242;

.meta {
  display: flex;
  flex-wrap: wrap;
  color: $font-2;
  & > div:not(.category) {
    cursor: default;
  }
  ::v-deep {
    .bold {
      font-weight: bolder;
    }
    .dividers {
      @extend .bold;
      margin: 0 4px;
    }
    .top {
      color: $topColor;
    }
  }
  .name {
    margin-left: 4px;
  }
  .sticky {
    .name {
      color: $topColor;
    }
  }
  .category {
    a:hover {
      text-decoration: underline;
    }
  }
}
</style>