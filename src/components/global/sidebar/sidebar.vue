<template>
  <div class="sidebar">
    <info></info>
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
  components: { recentArticle,category,tags, info }
};
</script>
