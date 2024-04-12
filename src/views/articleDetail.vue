<!-- 文章详情页 -->
<template>
  <Layout>
    <template #top>
      <Header class="Header" v-if="message.bg" v-bind="message"></Header>
    </template>
    <template #main>
      <div class="container">
        <Header v-if="!message.bg" v-bind="message" />
        <ArticleContent class="article" v-bind.sync="toc" />
        <div class="tags-share">
          <Tags />
          <Share />
        </div>
        <ToggleArticles class="toggle-articles" />
      </div>
    </template>
    <template #aside>
      <div class="sidebar">
        <nav class="catalog">
          <Catalog v-bind="toc" />
        </nav>
        <RecentArticle />
      </div>
    </template>
  </Layout>
</template>

<script>
import Layout from '@/components/global/Layout.vue';
import ArticleContent from '@/components/articleDetail/ArticleContent.vue';
import Header from '@/components/articleDetail/Header.vue';
import Catalog from '@/components/articleDetail/Catalog.vue';
import Share from '@/components/articleDetail/Share.vue';
import Tags from '@/components/articleDetail/Tags.vue';
import ToggleArticles from '@/components/articleDetail/ToggleArticles.vue';
import RecentArticle from '@/components/sidebar/RecentArticle.vue';

export default {
  components: {
    Layout,
    RecentArticle,
    ArticleContent,
    Header,
    Catalog,
    Share,
    Tags,
    ToggleArticles
  },
  data() {
    return {
      toc: {
        progress: '0',
        tree: [],
        activeTitleID: ''
      },
      message: {
        title: '逆光潜入',
        bg: require('@/assets/images/crowd-loading/crowd-background.jpg')
      }
    };
  },
  created() {
    //如果本文章页有设置封面，则让导航栏的字体颜色为#eee
    if (this.message.bg) this.$bus.$emit('change-font-color', '#eee');
  },
  beforeDestroy() {
    if (this.message.bg) this.$bus.$emit('change-font-color', '');
  }
};
</script>

<style lang="scss" scoped>
.Header {
  height: 400px;
  width: 100%;
  margin-bottom: 40px;
}
.container {
  @include main-content;
  .article {
    margin-bottom: 10px;
  }
  .tags-share {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
  .toggle-articles {
    margin-top: 40px;
  }
}
.sidebar {
  top: 20px;
  position: sticky;
  .catalog {
    max-height: calc(100vh - 120px);
    @media screen and (max-width: 900px) {
      width: 300px;
    }
  }
}
</style>