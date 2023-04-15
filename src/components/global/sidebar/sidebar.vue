<template>
  <div class="sidebar">
    <info :infoData="infoData"></info>
    <recentArticle></recentArticle>
    <category></category>
    <tags></tags>
  </div>
</template>

<script>
import tags from './tags.vue';
import category from './category.vue';
import recentArticle from './recentArticle.vue';
import info from './info.vue';
export default {
  components: { recentArticle,category,tags, info },
  data() {
    return {
      infoData: [
        { title: "文章", num: "64", src: "" },
        { title: "标签", num: "90", src: "" },
        { title: "分类", num: "18", src: "" },
      ]
    };
  }
};
</script>
