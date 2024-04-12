<template>
  <div class="sidebar">
    <info></info>
    <RecentArticle></RecentArticle>
    <category></category>
    <tags></tags>
  </div>
</template>

<script>
import tags from './tags.vue';
import category from './category.vue';
import RecentArticle from './RecentArticle.vue';
import info from './info.vue';
export default {
  components: { RecentArticle, category, tags, info }
};
</script>
