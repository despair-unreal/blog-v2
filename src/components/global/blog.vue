<!-- 部分博客页面：主内容加侧边栏 -->
<template>
  <Layout>
    <template #main>
      <router-view id="main-content" />
    </template>
    <template #aside>
      <sidebar id="sidebar"></sidebar>
    </template>
  </Layout>
</template>

<script>
import Layout from '@/components/global/Layout.vue';
import sidebar from '@/components/sidebar/sidebar.vue';
export default {
  components: {
    sidebar,
    Layout
  }
};
</script>

<style scoped>
</style>