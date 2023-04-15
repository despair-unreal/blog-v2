<template>
  <div id="container" class="layout">
    <router-view id="main-content" />
    <sidebar id="sidebar"></sidebar>
  </div>
</template>

<script>
import sidebar from './sidebar/sidebar.vue'
export default {
  components:{
    sidebar
  }
};
</script>

<style scoped>

</style>