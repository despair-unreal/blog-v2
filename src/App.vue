<!-- 根组件 -->
<template>
  <div id="app">
    <router-view />
    <navigation></navigation>
  </div>
</template>

<script>
import navigation from './components/global/navigation.vue'

export default {
  components: {
    navigation
  }
}
</script>

<style>

</style>
